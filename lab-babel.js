const Babel = require('@babel/core');

const internals = {};
internals.transform =  (content, filename) => {
  if (/^node_modules/.test(filename)) {
    return content;
  }

  const transformed = Babel.transform(content, {
    filename,
    sourceMap: 'inline',
    sourceFileName: filename,
    auxiliaryCommentBefore: '$lab:coverage:off$',
    auxiliaryCommentAfter: '$lab:coverage:on$'
  });

  return transformed.code;
};

internals.extensions = ['js', 'jsx', 'es', 'es6'];
internals.methods = [];
for (let i = 0, il = internals.extensions.length; i < il; ++i) {
  internals.methods.push({ ext: internals.extensions[i], transform: internals.transform });
}

module.exports = internals.methods;
