// Vercel Edge Function 代理示例
// 部署后国内可访问，函数在海外 Vercel 节点运行，可以访问 Google

// 这个函数接受一个 URL 参数，然后代理请求到目标网站
// 使用方式: https://你的项目.vercel.app/api/proxy?url=https://www.google.com

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing url parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // 在 Vercel Edge 节点发起请求（海外 IP）
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Mozi-Proxy/1.0)',
      },
    })

    // 获取响应内容
    const content = await response.arrayBuffer()

    // 返回响应和 headers
    return new Response(content, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/html',
        'Access-Control-Allow-Origin': '*',
        // 允许跨域
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
