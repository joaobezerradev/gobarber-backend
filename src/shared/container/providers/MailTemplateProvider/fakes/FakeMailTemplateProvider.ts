import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ temaplate }: IParseMailTemplateDTO): Promise<string> {
    return temaplate;
  }
}
