import { isBoolean } from 'class-validator';
import { NodemailerEmailService } from './nodemailer.email.service';

describe('NodemailerEmail Service', () => {
  const emailService = new NodemailerEmailService();
  const fakeTo = 'to';
  const fakeSubject = 'subject';
  const fakeText = 'text';

  describe('sendEmail', () => {
    it('shold return a Promise<bollean>', async () => {
      expect(emailService.transporter).toBeDefined();
      const response = await emailService.sendEmail(
        fakeTo,
        fakeSubject,
        fakeText,
      );
      const respForTest = isBoolean(response);
      expect(respForTest).toEqual(true);
    });
  });
});
