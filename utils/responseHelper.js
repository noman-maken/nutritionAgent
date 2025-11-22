export const createResponse = (body, status) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
});
