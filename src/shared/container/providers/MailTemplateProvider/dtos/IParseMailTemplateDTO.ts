interface ITemplateVariables {
  [key: string]: string | number;
}
export default interface IParseMailTemplateDTO {
  temaplate: string;
  variables: ITemplateVariables;
}
