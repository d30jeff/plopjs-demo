import fs from 'fs';
import { join } from 'path';
import { ActionType, NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
  const servers = fs.readdirSync(join(__dirname, './src/servers'));
  plop.load('plop-pack-json-modify');

  plop.setGenerator('Generator', {
    description: 'Generates a module based on user input',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: ['module', 'server'],
      },
      {
        type: 'input',
        name: 'server',
        message: 'What should we call the server?',
        when(answers) {
          return answers.type === 'server';
        },
      },
      {
        type: 'input',
        name: 'port',
        message: 'Which port should the server be running on?',
        when(answers) {
          return answers.type === 'server';
        },
      },
      {
        type: 'list',
        choices: servers,
        name: 'server',
        message: 'Which server should the module be created in?',
        when(answers) {
          return answers.type === 'module';
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'What module should we create',
        validate: (answer) => {
          return Boolean(answer);
        },
        when(answers) {
          return answers.type === 'module';
        },
      },
      {
        type: 'confirm',
        name: 'repository',
        message: 'Do you want to create a Repository?',
        default: false,
        when(answers) {
          return answers.type === 'module';
        },
      },
    ],
    actions: (data) => {
      const items: ActionType[] = [];
      if (data?.type === 'server') {
        createServer(data, items);
      } else if (data?.type === 'module') {
        createModule(data, items);
      }

      return items;
    },
  });
}

const createServer = (data: any, items: ActionType[]) => {
  const port = Number(data?.port);

  items.push(
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.server.ts',
      templateFile: 'templates/servers/server.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.controllers.ts',
      templateFile: 'templates/servers/controllers.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.services.ts',
      templateFile: 'templates/servers/services.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/healthcheck/healthcheck.controller.ts',
      templateFile: 'templates/servers/healthcheck/healthcheck.controller.ts.hbs',
    },
    {
      // Modify .env file
      type: 'append',
      path: '.env',
      template: `{{constantCase server}}_PORT=${port}`,
    },
    {
      // Modify config.provider file
      type: 'modify',
      path: 'src/providers/config.provider.ts',
      pattern: 'NODE_ENV: process.env.NODE_ENV,',
      template: `NODE_ENV: process.env.NODE_ENV,\n  {{constantCase server}}_PORT: Number(process.env.{{constantCase server}}_PORT),`,
    },
    {
      // Add
      type: 'json-modify-file' as any, // Point to this action
      force: false, // Overrides, create non existing
      JSONFile: './package.json' as any, // File to modify
      JSONKey: 'scripts', // Property to append to
      JSONEntryKey: '{{kebabCase server}}', // Property to add
      JSONEntryValue: `yarn copy-email-templates && node -r module-alias/register dist/servers/{{kebabCase server}}/{{kebabCase server}}.server.js`,
    } as any,
    {
      // Add
      type: 'json-modify-file' as any, // Point to this action
      force: false, // Overrides, create non existing
      JSONFile: './package.json' as any, // File to modify
      JSONKey: 'scripts', // Property to append to
      JSONEntryKey: '{{kebabCase server}}:dev', // Property to add
      JSONEntryValue: `NODE_ENV=development tsc-watch --onSuccess "yarn {{kebabCase server}}"`,
    } as any,
    {
      // Add
      type: 'json-modify-file' as any, // Point to this action
      force: false, // Overrides, create non existing
      JSONFile: './package.json' as any, // File to modify
      JSONKey: 'scripts', // Property to append to
      JSONEntryKey: '{{kebabCase server}}:staging', // Property to add
      JSONEntryValue: `NODE_ENV=staging yarn {{kebabCase server}}`,
    } as any,
    {
      // Add
      type: 'json-modify-file' as any, // Point to this action
      force: false, // Overrides, create non existing
      JSONFile: './package.json' as any, // File to modify
      JSONKey: 'scripts', // Property to append to
      JSONEntryKey: '{{kebabCase server}}:production', // Property to add
      JSONEntryValue: `NODE_ENV=production yarn {{kebabCase server}}`,
    } as any
  );

  // Docs
  items.push(
    {
      type: 'add',
      path: 'docs/{{kebabCase server}}/index.html',
      templateFile: 'templates/docs/index.html.hbs',
    },
    {
      type: 'add',
      path: 'docs/{{kebabCase server}}/swagger.yml',
      templateFile: 'templates/docs/swagger.yml.hbs',
    }
  );
};

const createModule = (data: any, items: ActionType[]) => {
  items.push(
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.middleware.ts',
      templateFile: 'templates/modules/module.middleware.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.dto.ts',
      templateFile: 'templates/modules/module.dto.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.response.ts',
      templateFile: 'templates/modules/module.response.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.exception.ts',
      templateFile: 'templates/modules/module.exception.ts.hbs',
    },
    {
      type: 'modify',
      pattern: ".controller';",
      template: `.controller';\nimport { {{pascalCase name}}Controller } from '@servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.controller';`,
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.controllers.ts',
    },
    {
      type: 'modify',
      pattern: 'export const controllers = [',
      template: `export const controllers = [\n  {{pascalCase name}}Controller,`,
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.controllers.ts',
    },
    {
      type: 'modify',
      pattern: 'export const services = {',
      template: `import { {{pascalCase name}}Service } from '@servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.service';\nexport const services = {`,
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.services.ts',
    },
    {
      type: 'modify',
      pattern: 'export const services = {',
      template: `export const services = {  {{camelCase name}}: new {{pascalCase name}}Service(),\n`,
      path: 'src/servers/{{kebabCase server}}/{{kebabCase server}}.services.ts',
    }
  );

  items.push({
    type: 'add',
    path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.interface.ts',
    templateFile: 'templates/modules/module.interface.ts.hbs',
  });

  if (data?.repository) {
    items.push(
      {
        type: 'add',
        path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.controller.ts',
        templateFile: 'templates/modules/module.controller.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.service.ts',
        templateFile: 'templates/modules/module.service.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/repositories/{{kebabCase name}}.repository.ts',
        templateFile: 'templates/repository.ts.hbs',
      },
      {
        type: 'modify',
        pattern: ".repository';",
        template: `.repository';\nimport { {{pascalCase name}}Repository } from '@repositories/{{kebabCase name}}.repository';`,
        path: 'src/repositories/index.repository.ts',
      },
      {
        type: 'modify',
        pattern: 'export const repositories = {',
        template: `export const repositories = {\n  {{camelCase name}}: new {{pascalCase name}}Repository(),`,
        path: 'src/repositories/index.repository.ts',
      }
    );
  } else {
    items.push(
      {
        type: 'add',
        path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.controller.ts',
        templateFile: 'templates/module/blank-controller.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/servers/{{kebabCase server}}/{{kebabCase name}}/{{kebabCase name}}.service.ts',
        templateFile: 'templates/module/blank-service.ts.hbs',
      }
    );
  }
};
