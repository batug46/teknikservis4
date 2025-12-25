import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
    try {
        const models = Object.keys(prisma).filter(key => key !== 'dmmf' && !key.startsWith('_'));

        // Try to access the model
        let count = -1;
        let status = 'Not Attempted';
        let error = null;

        try {
            if (prisma.serviceTracking) {
                count = await prisma.serviceTracking.count();
                status = 'Success';
            } else {
                status = 'Model Not Found on Prisma Client';
            }
        } catch (e) {
            status = 'Query Failed';
            error = e.message;
        }

        return NextResponse.json({
            availableModels: models,
            serviceTrackingStatus: status,
            count,
            error
        });
    } catch (err) {
        return NextResponse.json({
            fatalError: err.message,
            stack: err.stack
        }, { status: 500 });
    }
}
