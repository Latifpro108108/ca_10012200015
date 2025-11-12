import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (vendorId) where.vendorId = vendorId;
    if (status) where.status = status;

    const messages = await prisma.message.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { messages },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, vendorId, productId, subject, message } = body;

    // Validation
    if (!customerId || !vendorId || !subject || !message) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer ID, vendor ID, subject, and message are required',
        },
        { status: 400 }
      );
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    // Check if product exists (if provided)
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Product not found',
          },
          { status: 404 }
        );
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        customerId,
        vendorId,
        productId: productId || null,
        subject,
        message,
        status: 'unread',
      },
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

    return NextResponse.json(
      {
        status: 'success',
        message: 'Message sent successfully',
        data: { message: newMessage },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send message',
      },
      { status: 500 }
    );
  }
}

