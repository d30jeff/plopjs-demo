import { snakeCase } from 'snake-case';
import { pascalCase } from 'pascal-case';
import camelCase from 'camelcase';
import { titleCase } from 'title-case';

export class StringUtil {
  static Trim(params: string) {
    return params.replace(/\s{2,}/g, ' ').trim();
  }
  static SnakeCase(params: string): string {
    return snakeCase(params);
  }

  static PascalCase(params: string): string {
    return pascalCase(params);
  }

  static TitleCase(params: string): string {
    return titleCase(params);
  }

  static CamelCase(params: string): string {
    return camelCase(params);
  }
}
