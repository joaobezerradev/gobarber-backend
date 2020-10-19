export default interface IEmailProvider {
  sendMail(to: string, body: string): Promise<void>;
}
