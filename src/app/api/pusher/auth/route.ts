
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Pusher from 'pusher';

// Replace with your Pusher credentials
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // Presence channel
  const userData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      email: session.user.email,
    },
  };

  const authResponse = pusher.authorizeChannel(socketId, channel, userData);
  res.send(authResponse);
}
