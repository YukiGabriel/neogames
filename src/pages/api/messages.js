let messages = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ messages });
  }
  
  if (req.method === 'POST') {
    const { text } = req.body;
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleString('pt-BR')
    };
    messages = [newMessage, ...messages];
    return res.status(200).json({ success: true, message: newMessage });
  }
  
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (id === 'all') {
      messages = [];
    } else {
      messages = messages.filter(m => m.id !== parseInt(id));
    }
    return res.status(200).json({ success: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
