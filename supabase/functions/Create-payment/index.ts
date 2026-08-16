import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed',{status:405})
  const auth = req.headers.get('Authorization') || ''
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {global:{headers:{Authorization:auth}}})
  const {data:{user}} = await supabase.auth.getUser()
  if (!user) return Response.json({error:'Unauthorized'},{status:401})

  const {orderId} = await req.json()
  const {data:order,error} = await supabase.from('orders').select('id,total_amount').eq('id',orderId).eq('user_id',user.id).single()
  if(error || !order) return Response.json({error:'Order not found'},{status:404})

  // Connect your chosen Iranian payment gateway here.
  // Secrets must be stored in Supabase Edge Function secrets, never in VITE_ env vars.
  const gatewayUrl=Deno.env.get('PAYMENT_GATEWAY_URL')
  const merchantId=Deno.env.get('PAYMENT_MERCHANT_ID')
  const callbackUrl=Deno.env.get('PAYMENT_CALLBACK_URL')
  if(!gatewayUrl || !merchantId || !callbackUrl)
    return Response.json({error:'Payment gateway is not configured yet.'},{status:503})

  const gatewayResponse=await fetch(gatewayUrl,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({merchant_id:merchantId,amount:order.total_amount,callback_url:callbackUrl,order_id:order.id})
  })
  const result=await gatewayResponse.json()
  if(!gatewayResponse.ok) return Response.json({error:result},{status:502})

  await supabase.from('orders').update({payment_status:'pending',payment_authority:result.authority ?? result.data?.authority}).eq('id',order.id)
  return Response.json({paymentUrl:result.payment_url ?? result.data?.payment_url, authority:result.authority ?? result.data?.authority})
})
