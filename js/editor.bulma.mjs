/*! Editor Bulma styling 3.0.0-dev for DataTables
 * Copyright (c) SpryMedia Ltd - https://datatables.net/license/plus
 */

import DataTable from 'datatables.net-bm';
import Editor from 'datatables.net-editor';


/*
 * Set the default display controller to be our bulma control
 */
DataTable.Editor.defaults.display = 'bulma';

const Dom = DataTable.Dom;
const util = DataTable.util;

/*
 * Change the default classes from Editor to be classes for Bulma
 */
util.object.assignDeep(DataTable.Editor.classes, {
	header: {
		wrapper: 'DTE_Header',
		content: 'modal-card-title'
	},
	body: {
		wrapper: 'DTE_Body'
	},
	footer: {
		wrapper: 'DTE_Footer'
	},
	form: {
		tag: 'form-horizontal',
		button: 'button',
		buttonInternal: 'button',
		buttonSubmit: 'button is-primary',
		error: 'DTE_Form_Error help is-danger'
	},
	field: {
		inputError: 'is-danger',
		wrapper: 'DTE_Field field',
		label: 'label',
		'msg-error': 'DTE_Field_Error help is-danger',
		'msg-message': 'help',
		'msg-info': 'help',
		multiValue: 'card multi-value',
		multiInfo: 'small',
		multiRestore: 'card multi-restore'
	}
});

util.object.assignDeep(DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'button is-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'button is-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'button is-danger'
		}
	}
});

DataTable.Editor.fieldTypes.datatable.tableClass = 'table';

/*
 * Bulma display controller - this is effectively a proxy to the Bulma
 * modal control.
 */

const domEls = {
	content: Dom
		.c('div')
		.classAdd('modal DTED')
		.append(Dom.c('div').classAdd('modal-background'))
		.append(Dom.c('div').classAdd('modal-card-wrapper'))
};

DataTable.Editor.display.bulma = util.object.assignDeep(
	{},
	DataTable.Editor.models.displayController,
	{
		/*
		 * API methods
		 */
		init: function (dte) {
			// Add `form-control` to required elements
			dte.on('displayOrder.dtebm open.dtebm', function () {
				util.object.each(dte.s.fields, function (key, field) {
					var node = Dom.s(field.node());

					node.find(
						'input:not([type=checkbox]):not([type=radio]), select, textarea'
					).classAdd('input');

					node.find(
						'input[type=checkbox], input[type=radio]'
					).classRemove('input');

					node.find('select')
						.classAdd('select')
						.parent()
						.classAdd('select');

					node.find('select[multiple]')
						.parent()
						.classAdd('is-multiple');
				});
			});

			return DataTable.Editor.display.bulma;
		},

		open: function (dte, appendIn, callback) {
			var append = Dom.s(appendIn);

			append.find('.DTE_Header').classAdd('modal-card-head');
			append.find('.DTE_Body').classAdd('modal-card-body');
			append.find('.DTE_Footer').classAdd('modal-card-foot');

			domEls.content.find('div.modal-card-wrapper').children().detach();

			append
				.classAdd('modal-card')
				.appendTo(domEls.content.find('div.modal-card-wrapper'));

			domEls.content.find('button.delete').remove();
			domEls.content.classRemove('is-hidden').classAdd('is-active');
			domEls.content.appendTo('body');

			// Setup events on each show
			Dom.c('button')
				.classAdd('delete')
				.attr('title', dte.i18n('close'))
				.one('click', function () {
					dte.close('icon');
				})
				.appendTo(append.find('.modal-card-head'));

			// This is a bit horrible, but if you mousedown and then drag out of
			// the modal container, we don't want to trigger a background
			// action.
			let allowBackgroundClick = false;

			Dom.s(document)
				.off('mousedown.dte-bs5')
				.on('mousedown.dte-bs5', 'div.modal-background', function (e) {
					allowBackgroundClick = Dom.s(e.target).classHas(
						'modal-background'
					);
				});

			Dom.s(document)
				.off('click.dte-bs5')
				.on('click.dte-bs5', 'div.modal-background', function (e) {
					if (
						Dom.s(e.target).classHas('modal-background') &&
						allowBackgroundClick
					) {
						dte.background();
					}
				});

			if (callback) {
				callback();
			}

			return;
		},

		close: function (dte, callback) {
			domEls.content.find('button.delete').remove();

			domEls.content.classRemove('is-active').classAdd('is-hidden');

			if (callback) {
				callback();
			}
		},

		node: function () {
			return domEls.content.get(0);
		}
	}
);


export default DataTable.Editor;

