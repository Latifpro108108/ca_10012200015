import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/messages/:id - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vendor: {
          select: {
            vendorName: true,
            email: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Message not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { message },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch message',
      },
      { status: 500 }
    );
  }
}

// PUT /api/messages/:id - Update message status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Status is required',
        },
        { status: 400 }
      );
    }

    // Valid statuses
    const validStatuses = ['unread', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid status. Must be one of: unread, read, replied',
        },
        { status: 400 }
      );
    }

    const message = await prisma.message.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vendor: {
          select: {
            vendorName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Message updated successfully',
      data: { message },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update message',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/:id - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Message deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete message',
      },
      { status: 500 }
    );
  }
}

