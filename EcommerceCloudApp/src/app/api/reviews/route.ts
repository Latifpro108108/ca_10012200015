import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reviews - Get reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const customerId = searchParams.get('customerId');
    const minRating = searchParams.get('minRating');

    const where: any = {};

    if (productId) where.productId = productId;
    if (customerId) where.customerId = customerId;
    if (minRating) where.rating = { gte: parseInt(minRating, 10) };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            productName: true,
            imageURL: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: {
        reviews,
        count: reviews.length,
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch reviews',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerId, rating, comment } = body;

    if (!productId || !customerId || rating === undefined) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please provide productId, customerId, and rating',
        },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating, 10);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rating must be between 1 and 5',
        },
        { status: 400 }
      );
    }

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

    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        customerId,
      },
    });
    if (existingReview) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You have already reviewed this product',
        },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerId,
        rating: parsedRating,
        comment: comment || null,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            productName: true,
            imageURL: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Review created successfully',
        data: { review },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create review',
      },
      { status: 500 }
    );
  }
}
