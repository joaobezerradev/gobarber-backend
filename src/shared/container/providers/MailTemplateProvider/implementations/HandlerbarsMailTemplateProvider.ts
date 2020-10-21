import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandlerbarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({
    temaplate,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const parseTemplate = handlebars.compile(temaplate);

    return parseTemplate(variables);
  }
}
