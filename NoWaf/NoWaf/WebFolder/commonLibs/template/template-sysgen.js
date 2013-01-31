﻿var SysGen;SysGen = SysGen || {};// TODO: Debugging mode vs stop-on-error mode - runtime flag.// TODO: Handle || (or) characters and backslashes.// TODO: Add more modifiers.SysGen.Template = function(source, name, definition) {    this.name       = name;    this.source     = source;     this.definition = definition || SysGen.Template.definition;    console.log(Sysgen.Template.definition);    debugger;    this.fields     = [];    this.sourceFunc = this.parse();    console.log(this.sourceFunc);    this.func       = eval(this.sourceFunc);    this.toString   = function() { return "SysGen.Template [" + this.name + "]"; }};SysGen.Template.prototype.process = function(context, flags) {    if (context == null)        context = {};    if (flags == null)        flags = {};    var resultArr = [];    var resultOut = { write: function(m) { resultArr.push(m); } };    try {        this.func(resultOut, context, this.definition.modifiers, flags);    } catch (e) {        if (flags.throwExceptions == true)            throw e;        //var result = new String(resultArr.join("") + "[ERROR: " + e.toString() + (e.message ? '; ' + e.message : '') + "]");        var result = "Erreur d'affichage";        console.warn("Template error : " + resultArr.join("") + "[ERROR: " + e.toString() + (e.message ? '; ' + e.message : '') + "]");        result["exception"] = e;        return result;    }    return resultArr.join("");};SysGen.Template.prototype.parse = function() {    body = this.source.cleanWhiteSpace();    this.sourceFunc = [ "var Template_TEMP = function(_OUT, _CONTEXT, _MODIFIERS,_FLAGS) { function defined(str) { return (_CONTEXT[str] != undefined); } with (_CONTEXT) {" ];    this.state    = { stack: [], line: 1, field_prefixes_stack: [] };                              // TODO: Fix line number counting.    var endStmtPrev = -1;    while (endStmtPrev + 1 < body.length) {        var begStmt = endStmtPrev;        // Scan until we find some statement markup.        begStmt = body.indexOf("{", begStmt + 1);        while (begStmt >= 0) {            var endStmt = body.indexOf('}', begStmt + 1);            var stmt = body.substring(begStmt, endStmt);            var blockrx = stmt.match(/^\{(cdata|minify|eval)/); // From B. Bittman, minify/eval/cdata implementation.            if (blockrx) {                var blockType = blockrx[1];                 var blockMarkerBeg = begStmt + blockType.length + 1;                var blockMarkerEnd = body.indexOf('}', blockMarkerBeg);                if (blockMarkerEnd >= 0) {                    var blockMarker;                    if( blockMarkerEnd - blockMarkerBeg <= 0 ) {                        blockMarker = "{/" + blockType + "}";                    } else {                        blockMarker = body.substring(blockMarkerBeg + 1, blockMarkerEnd);                    }                                                                var blockEnd = body.indexOf(blockMarker, blockMarkerEnd + 1);                    if (blockEnd >= 0) {                                                    this.emitSectionText(body.substring(endStmtPrev + 1, begStmt));                                                var blockText = body.substring(blockMarkerEnd + 1, blockEnd);                        if (blockType == 'cdata') {                            this.emitText(blockText);                        } else if (blockType == 'minify') {                            this.emitText(blockText.scrubWhiteSpace());                        } else if (blockType == 'eval') {                            if (blockText != null && blockText.length > 0) // From B. Bittman, eval should not execute until process().                                this.sourceFunc.push('_OUT.write( (function() { ' + blockText + ' })() );');                        }                        begStmt = endStmtPrev = blockEnd + blockMarker.length - 1;                    }                }                                    } else if (body.charAt(begStmt - 1) != '$' &&               // Not an expression or backslashed,                       body.charAt(begStmt - 1) != '\\') {              // so check if it is a statement tag.                if(Object.keys(this.definition.tags)                    .any(function(tag) { return body.substring(begStmt + 1).startsWith(tag); }))                    break; // Found a match.            }            begStmt = body.indexOf("{", begStmt + 1);        }        if (begStmt < 0)                              // In "a{for}c", begStmt will be 1.            break;        var endStmt = body.indexOf("}", begStmt + 1); // In "a{for}c", endStmt will be 5.        if (endStmt < 0)            break;        this.emitSectionText(body.substring(endStmtPrev + 1, begStmt));        this.emitStatement(body.substring(begStmt, endStmt + 1));        endStmtPrev = endStmt;    }    this.emitSectionText(body.substring(endStmtPrev + 1));    if (this.state.stack.length != 0)        this.throwError("unclosed, unmatched statement(s): " + this.state.stack.join(","));    this.sourceFunc.push("}}; Template_TEMP");    return this.sourceFunc = this.sourceFunc.join("");}SysGen.Template.prototype.emitStatement = function(statement) {    statement = statement.slice(1, -1).trim();    var tag = statement.split(/ /, 1)[0];    var definition = this.definition.tags[tag];    if (!definition) // Not a real statement.        return this.emitSectionText(statement);    if (definition.delta < 0) {        if (this.state.stack.length <= 0)            this.throwError("close tag does not match any previous statement: " + statement);        this.state.stack.pop();    }     if (definition.delta > 0)        this.state.stack.push(statement);    if (definition.regexp && !definition.regexp.test(statement))        this.throwError("statement is incorrect: " + statement);    if (definition.generator)        this.sourceFunc.push(definition.generator.call(this, statement));    else         this.sourceFunc.push(definition.code);}SysGen.Template.prototype.emitSectionText = function(text) {    if (text.length <= 0)        return;    var nlPrefix = 0;               // Index to first non-newline in prefix.    var nlSuffix = text.length - 1; // Index to first non-space/tab in suffix.    while (nlPrefix < text.length && (text.charAt(nlPrefix) == '\n'))        nlPrefix++;    while (nlSuffix >= 0 && (text.charAt(nlSuffix) == ' ' || text.charAt(nlSuffix) == '\t'))        nlSuffix--;    if (nlSuffix < nlPrefix)        nlSuffix = nlPrefix;    if (nlPrefix > 0) {        this.sourceFunc.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');        var s = text.substring(0, nlPrefix).replace('\n', '\\n'); // A macro IE fix from BJessen.        if (s.charAt(s.length - 1) == '\n')            s = s.substring(0, s.length - 1);        this.sourceFunc.push(s);        this.sourceFunc.push('");');    }    var lines = text.substring(nlPrefix, nlSuffix + 1).split('\n');    for (var i = 0; i < lines.length; i++) {        this.emitSectionTextLine(lines[i]);        if (i < lines.length - 1)            this.sourceFunc.push('_OUT.write("\\n");\n');    }    if (nlSuffix + 1 < text.length) {        this.sourceFunc.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');        var s = text.substring(nlSuffix + 1).replace('\n', '\\n');        if (s.charAt(s.length - 1) == '\n')            s = s.substring(0, s.length - 1);        this.sourceFunc.push(s);        this.sourceFunc.push('");');    }}SysGen.Template.prototype.emitSectionTextLine = function(line) {    var endMarkPrev = '}';    var endExprPrev = -1;    while (endExprPrev + endMarkPrev.length < line.length) {        var begMark = "${", endMark = "}";        var begExpr = line.indexOf(begMark, endExprPrev + endMarkPrev.length); // In "a${b}c", begExpr == 1        if (begExpr < 0)            break;        if (line.charAt(begExpr + 2) == '%') {            begMark = "${%";            endMark = "%}";        }        var endExpr = line.indexOf(endMark, begExpr + begMark.length);         // In "a${b}c", endExpr == 4;        if (endExpr < 0)            break;        this.emitText(line.substring(endExprPrev + endMarkPrev.length, begExpr));        this.sourceFunc.push('_OUT.write(',                             this.emitExpression(line.substring(begExpr + begMark.length, endExpr)),                             ');');        endExprPrev = endExpr;        endMarkPrev = endMark;    }    this.emitText(line.substring(endExprPrev + endMarkPrev.length)); }SysGen.Template.prototype.emitText = function(text) {    if (text == null ||        text.length <= 0)        return;    text = text.replace(/\\/g, '\\\\');    text = text.replace(/\n/g, '\\n');    text = text.replace(/"/g,  '\\"');    this.sourceFunc.push('_OUT.write("');    this.sourceFunc.push(text);    this.sourceFunc.push('");');}SysGen.Template.prototype.emitExpression = function(expression) {    // Example: exprs == 'firstName|default:"John Doe"|capitalize'.split('|')    // Ex: foo|a:x|b:y1,y2|c:z1,z2 is emitted as c(b(a(foo,x),y1,y2),z1,z2)    var exprArr = expression.replace(/\|\|/g, "#@@#").split('|');    for (var k in exprArr) {        if (exprArr[k].replace) // IE 5.x fix from Igor Poteryaev.            exprArr[k] = exprArr[k].replace(/#@@#/g, '||');    }    // Ex: exprArr == [firstName,capitalize,default:"John Doe"]    var start = [];    var end = [];    var expr;    // Ex: expr    == 'default:"John Doe"'    while(expr = exprArr.pop()) {        if(!exprArr.length) {            this.fields.pushUnique(this.getPath(expr));            var ctx = '_CONTEXT';            var r = /^([^\.\[]+)\.?(.*)$/.exec(expr);            //console.log(r);            if(this.state.field_prefixes_stack                    .any(function(i) { return r[1] == i[0]; })) {                ctx = r[1];                expr = r[2];            }            return start.join('') + 'this.evalExpression(' + ctx + ', ' + Object.toJSON(expr) + ')' + end.join('');        }        var parts = /^([^:]+):(.+)$/.exec(expr);        parts.shift();        start.push('_MODIFIERS["',                    parts[0],       // The parts[0] is a modifier function name, like capitalize.                    '"](');        end.splice(0, 0, ')');        if (parts.length > 1)            end.splice(0, 0, ',', parts[1])    }}SysGen.Template.prototype.evalExpression = function(ctx, path) {    var p = path.split('.');    try {        var r = eval('ctx' + (path.startsWith('[') ? '' : '.') + p[0]);    }catch(e) {        console.warn(e, 'ctx' + (path.startsWith('[') ? '' : '.') + p[0]);        throw e;    }    if(typeof r != 'object' || !r) return r;    if(Object.isArray(r) && p.length > 1) { //FIXME if the last element is a list, we must not return the first element if we are in a loop. In the futur, we should implement a way to return the list only when we are in a loop...        if(Object.isUndefined(r[0])) return '';        return this.evalExpression(r[0], p.slice(1).join('.'));    }    if(p.length == 1)        return r;    return this.evalExpression(r, p.slice(1).join('.'));};SysGen.Template.prototype.getPath = function(expr) {    var r = /^([^\.\[]+)(.*)/.exec(expr);    for(var i = this.state.field_prefixes_stack.length - 1; i >= 0; i--)        if(this.state.field_prefixes_stack[i][0] == r[1])            return this.getPath(this.state.field_prefixes_stack[i][1] + r[2]);    return expr.replace(/\[\d+\]/g, '').replace(/\[['"]([^\]]+)["']\]/g, '.$1');};SysGen.Template.prototype.getProperties = function(radix) {    if(radix)        return this.fields.grep(new RegExp('^' + radix + '\\.'), function(f) { return f.substr(radix.length + 1); });    return this.fields;};SysGen.Template.prototype.toJSON = function() { return; };SysGen.Template.prototype.throwError = function(str) {    throw new SysGen.Template.ParseError(this.name, this.state.line, str);}// Error handlingSysGen.Template.ParseError = function(name, line, message) {    this.name    = name;    this.line    = line;    this.message = message;}SysGen.Template.ParseError.prototype.toString = function() {     return ("Template ParseError in " + this.name + ": line " + this.line + ", " + this.message);}SysGen.Template.definition = {            // Exposed for extensibility.    tags: { // Lookup table for statement tags.        "if"     : { delta:  1, regexp: /^if *(.+)$/, generator: function(statement) {                        var stmtParts = SysGen.Template.definition.tags['if'].regexp.exec(statement);                        var ret = [ "if (" ];                        ret.push(statement ? this.emitExpression(stmtParts[1]) : "true"); // handle boolean operators                        ret.push(') {');                        return ret.join('');                    } },        "else"   : { delta:  0, code: "} else {" },        "elseif" : { delta:  0, regexp: /^elseif *(.+)$/, generator: function(statement) {                        var stmtParts = SysGen.Template.definition.tags.elseif.regexp.exec(statement);                        var ret = [ "} else if (" ];                        ret.push(statement ? this.emitExpression(stmtParts[1]) : "true"); // handle boolean operators                        ret.push(') {');                        return ret.join('');                    } },        "/if"    : { delta: -1, code: "}" },        "for"    : { delta:  1, regexp: /^for *([a-z0-9_$]+) *in *(.+)$/i,                     generator : function(statement) {                        var stmtParts = SysGen.Template.definition.tags['for'].regexp.exec(statement);                        if (!stmtParts)                            this.throwError("bad for loop statement: " + statement);                        this.state.field_prefixes_stack.push([ stmtParts[1], stmtParts[2] ]);                        var iterVar = stmtParts[1];                        var listVar = "__LIST__" + iterVar;                        return [ "(function() { var ", listVar, " = ", this.emitExpression(stmtParts[2]), ";",                             "var ", iterVar, "_iterator = $A(Object.iterator(", listVar, "));",                             "if(", iterVar, "_iterator.length) {",                             "for(var ", iterVar, "_count0 = 0; ", iterVar, "_count0 < ", iterVar, "_iterator.length; ", iterVar, "_count0++) {",                             "var ", iterVar, "_index = ", iterVar, "_iterator[", iterVar, "_count0];",                             "var ", iterVar, " = ", listVar, "[", iterVar, "_index];",                             "var ", iterVar, "_count = ", iterVar, "_count0 + 1;"                        ].join("");                     } },        "forelse" : { delta:  0, regexp: /^forelse *(.+)$/, generator: function(statement) {                        var stmtParts = SysGen.Template.definition.tags.forelse.regexp.exec(statement);                        var ret = [ "} } else if (" ];                        ret.push(statement ? this.emitExpression(stmtParts[1]) : "true"); // handle boolean operators                        ret.push(') {');                        return ret.join('');                    } },        "/for"    : { delta: -1, generator: function(statement) {                        this.state.field_prefixes_stack.pop();                        return "} } }).call(this);";                    } },        "var"     : { delta:  0, regexp: /^var *([a-z0-9_$]+) *= *(.+)$/i,                       generator: function(statement) { return statement + ';'; } },        "macro"   : { delta:  1, regexp: /^macro *([a-z0-9_$]+) *(\( *[a-z0-9_$]+( *, *[a-z0-9_$]+) *\))$/i,                      generator : function(statement) {                          var stmtParts = SysGen.Template.definition.tags.macro.regexp.exec(statement);                          var macroName = stmtParts[1].split('(')[0];                          return [ "var ", stmtParts[1], " = function", stmtParts[2],                                    "{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; " ].join('');                     } },         "/macro"  : { delta: -1, code: " return _OUT_arr.join(''); }.bind(this);" },        "with"    : { delta: 1, regexp: /^with *(.+)$/i,                      generator: function(statement) {                        var stmtParts = SysGen.Template.definition.tags['with'].regexp.exec(statement);                        this.state.field_prefixes_stack.push([ "", stmtParts[1] ]);                        return "with(" + stmtParts[1] + ") {";                    } },        "/with"   : { delta: -1, code: "}" },        "application_url" : { delta: 0, code: "_OUT.write( metadata.config.application_url || \"http://localhost/\" );" },        "today" : { delta: 0, code: "_OUT.write(new Date().format('yyyy-mm-dd'));" },        "now" : { delta: 0, code: "_OUT.write(new Date().format('yyyy-mm-dd HH:MM:ss'));" }    },    modifiers: {        "eat"        : function(v)    { return ""; },        "escape"     : function(s)    { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },        "capitalize" : function(s)    { return String(s).toUpperCase(); },        "default"    : function(s, d) { return s || d; },        "length"     : function(l)    { return l && l.length; },        "join"       : function(l, d) { return l && l.join(d); },        "subStr"     : function(v, s, l) { return v && (l ? v.substr(s, l) : v.substr(s)); },        "dateFormat" : function(d, motif) {            if (!d || d == "") return d;            var date_arr = d.split(/[ T\-\\:]/);            date_arr[1]--;            return (date_arr[3] ? new Date(date_arr[0], date_arr[1], date_arr[2], date_arr[3], date_arr[4], date_arr[5]) : new Date(date_arr[0], date_arr[1], date_arr[2])).format(motif); },        "set"        : function(code, k) {             return typeof code != 'undefined' && code.set && String(code.set[k]) || '';        }    }};SysGen.Template.definition.modifiers.h = SysGen.Template.definition.modifiers.escape;String.prototype.process = function(context, optFlags) {    var template = new SysGen.Template(this);    return template.process(context, optFlags);};String.prototype.cleanWhiteSpace = function() {    var result = this.replace(/\t/g,   "    ");    result = result.replace(/\r\n/g, "\n");    result = result.replace(/\r/g,   "\n");    result = result.replace(/^(\s*\S*(\s+\S+)*)\s*$/, '$1'); // Right trim by Igor Poteryaev.    return result;};String.prototype.scrubWhiteSpace = function() {    var result = this.replace(/^\s+/g,   "");    result = result.replace(/\s+$/g,   "");    result = result.replace(/\s+/g,   " ");    result = result.replace(/^(\s*\S*(\s+\S+)*)\s*$/, '$1'); // Right trim by Igor Poteryaev.    return result;};