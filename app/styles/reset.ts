import { withStyles } from '@material-ui/styles';

export default withStyles({
    '@global': {
        'html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video': {
            margin: 0,
            padding: 0,
            border: 0,
            fontSize: '100%',
            font: 'inherit',
            verticalAlign: 'baseline',
        },
        ':focus': {
            outline: 0,
        },
        'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section': {
            display: 'block',
        },
        'body': {
            lineHeight: 1,
        },
        'ol, ul': {
            listStyle: 'none',
        },
        'table': {
            borderCollapse: 'collapse',
            borderSpacing: 0,
        },
        'input[type=search]::-webkit-search-cancel-button, input[type=search]::-webkit-search-decoration, input[type=search]::-webkit-search-results-button, input[type=search]::-webkit-search-results-decoration': {
            '-webkit-appearance': 'none',
            '-moz-appearance': 'none',
        },
        'input[type=search]': {
            '-webkit-appearance': 'none',
            '-moz-appearance': 'none',
            '-webkit-box-sizing': 'content-box',
            '-moz-box-sizing': 'content-box',
            'box-sizing': 'content-box',
        },
        'textarea': {
            overflow: 'auto',
            verticalAlign: 'top',
            resize: 'vertical',
        },
        'html': {
            'fontSize': '100%',
            '-webkit-text-size-adjust': '100%',
            '-ms-text-size-adjust': '100%',
        },
        'a:focus': {
            outline: 'thin dotted',
        },
        'a:active, a:hover': {
            outline: 0,
        },
        'img': {
            'border': 0,
            '-ms-interpolation-mode': 'bicubic',
        },
        'figure': {
            margin: 0,
        },
        'form': {
            margin: 0,
        },
        'button, input, select, textarea': {
            'fontSize': '100%',
            'margin': 0,
            'verticalAlign': 'baseline',
            '*verticalAlign': 'middle',
        },
        'button, input': {
            lineHeight: 'normal',
        },
        'button, select': {
            textTransform: 'none',
        },
        'button, html input[type="button"], input[type="reset"], input[type="submit"]': {
            '-webkit-appearance': 'button',
            'cursor': 'pointer',
            '*overflow': 'visible',
        },
        'button[disabled], html input[disabled]': {
            cursor: 'default',
        },
        'input[type="checkbox"], input[type="radio"]': {
            'boxSizing': 'border-box',
            'padding': 0,
            '*height': '13px',
            '*width': '13px',
        },
        'input[type="search"]': {
            '-webkit-appearance': 'textfield',
            '-moz-box-sizing': 'content-box',
            '-webkit-box-sizing': 'content-box',
            'boxSizing': 'content-box',
        },
        'input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration': {
            '-webkit-appearance': 'none',
        },
        'button::-moz-focus-inner, input::-moz-focus-inner': {
            border: 0,
            padding: 0,
        },
        'fieldset': {
            border: 0,
            margin: 0,
            padding: 0,
        },
    },
});
