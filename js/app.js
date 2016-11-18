const Backbone = require('backbone');
const Handsontable = require('handsontable');
const _ = require('underscore');

const UserModel = Backbone.Model.extend({
  defaults: {
    team: {
      name: '研究開発',
      job: {
        main: 'javascript開発',
        sub:  '社内システム開発'
      }
    }
  }
});

const UserCollection = Backbone.Collection.extend({
  model: UserModel,
  splice: hackedSplice
});

document.addEventListener("DOMContentLoaded", () => {
  let users = new UserCollection();

  users.add([
    { name: 'Employee 1', deptName: 'Dept 1' },
    { name: 'Employee 2', deptName: 'Dept 2' },
    { name: 'Employee 3', deptName: 'Dept 3' }
  ]);

  const container = document.getElementById('handsontable');

  let hot = new Handsontable(container, {
    data: users,
    contextMenu: ['remove_row'],
    columns: [
      {
        data: (model, value) => {
          if (_.isUndefined(value)) { return model.get('deptName'); }
          model.set('deptName', value);
        },
        type: 'text'
      },
      {
        data: (model, value) => {
          if (_.isUndefined(value)) { return model.get('name'); }
          model.set('name', value);
        },
        type: 'text'
      },
      {
        data: (model) => {
          return model.get('team').name;
        },
        type: 'text',
        readOnly: true
      },
      {
        data: (model) => {
          return model.get('team').job.main;
        },
        type: 'text',
        readOnly: true
      },
      {
        data: (model, value) => {
          if (_.isUndefined(value)) { return model.get('role'); }
          model.set('role', value);
        },
        editor: 'select',
        selectOptions: ['アナリスト', 'デザイナー', 'プログラマー']
      }
    ],
    colHeaders: ['部署', '名前', 'チーム名', 'チームの仕事内容', '役割'],
    tableClassName: ['table', 'table-hover', 'table-striped'],
    stretchH: 'all',
    columnSorting: true,
    sortIndicator: true,
    manualRowResize: false,
    manualColumnResize: true
  });

  setTimeout(function() {
    hot.getPlugin('observeChanges').disablePlugin();
  }, 500);

  users
    .on('all', logEvents)
    .on('add', function() { hot.render(); })
    .on('remove', function() { hot.render(); });
});

function attr(attr) {
  return {
    data: (model, value) => {
      if (_.isUndefined(value)) { return model.get(attr); }
      model.set(attr, value);
    },
    type: 'text'
  };
}

function hackedSplice(index, howMany /* model1, ... modelN */) {
  let args = _.toArray(arguments).slice(2).concat({at: index}),
    removed = this.models.slice(index, index + howMany);
  this.remove(removed).add.apply(this, args);
  return removed;
}

function logEvents(event, model) {
  let now = new Date();
  console.log([':', now.getSeconds(), ':', now.getMilliseconds(), '[' + event + ']', JSON.stringify(model)].join(' '));
}
