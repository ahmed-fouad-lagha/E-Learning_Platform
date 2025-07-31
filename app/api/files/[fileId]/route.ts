import { NextRequest, NextResponse } from 'next/server'
import { getFile } from '@/lib/file-storage'

interface Params {
  fileId: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { fileId } = await params

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Decode the file path
    const filePath = decodeURIComponent(fileId)

    // Get file data
    const fileData = await getFile(filePath)

    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Determine content type based on file extension
    const getContentType = (fileName: string): string => {
      const ext = fileName.toLowerCase().split('.').pop()
      switch (ext) {
        case 'pdf':
          return 'application/pdf'
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg'
        case 'png':
          return 'image/png'
        case 'gif':
          return 'image/gif'
        case 'txt':
          return 'text/plain'
        case 'doc':
          return 'application/msword'
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        default:
          return 'application/octet-stream'
      }
    }

    const contentType = getContentType(filePath)

    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('File serving error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}