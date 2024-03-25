import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private readonly fcm: admin.messaging.Messaging;

  constructor() {
    // Initialize Firebase Admin SDK with service account credentials
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });

    this.fcm = admin.messaging();
  }

  async sendPushNotification(notificationData: any) {
    try {
      // Constructing the message payload
      const message: admin.messaging.Message = {
        notification: {
          // Customize payload data as needed
          title: notificationData.title,
          body: notificationData.body,
          // Add any additional data needed by the client-side
        },
        // Specify the token/device ID of the recipient
        token: notificationData.deviceToken,
      };

      // Send the message
      const response = await this.fcm.send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
