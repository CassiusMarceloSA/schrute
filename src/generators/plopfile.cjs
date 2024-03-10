// @TODO - Include configs to create Hooks and Services 

module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../components/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: '../components/{{pascalCase name}}/__test__/{{pascalCase name}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      },
      {
        type: 'append',
        path: '../components/index.ts',
        template: `export { default as {{pascalCase name}} } from './{{pascalCase name}}';\n`
      }
    ]
  })

  plop.setGenerator('page', {
    description: 'Create a new page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your page name?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../pages/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/Page.tsx.hbs'
      },
      {
        type: 'add',
        path: '../pages/{{pascalCase name}}/__test__/{{pascalCase name}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      },
    ]
  })
}
