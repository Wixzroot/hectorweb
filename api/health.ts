export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).json({ status: 'ok', service: 'Hector Hosting API', timestamp: Date.now() });
}
