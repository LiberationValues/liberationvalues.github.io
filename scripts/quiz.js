var max_radi, max_coop, max_ownr, max_glob, max_prog, max_rebl, max_mark // Max possible scores
max_radi = max_coop = max_ownr = max_glob = max_prog = max_rebl = max_mark = 0;
var radi, coop, ownr, glob, prog, rebl, mark // User's scores
radi = coop = ownr = glob = prog = rebl = mark = 0;
var qn = 0; // Question number
var prev_answer = null;
fetch("JSON/questions.json")
    .then(response => response.json())
    .then(data => load_questions(data))

function load_questions(data) {
    questions = data
    for (var i = 0; i < questions.length; i++) {
        max_radi += Math.abs(questions[i].effect.radi)
        max_coop += Math.abs(questions[i].effect.coop)
        max_ownr += Math.abs(questions[i].effect.ownr)
        max_glob += Math.abs(questions[i].effect.glob)
        max_prog += Math.abs(questions[i].effect.prog)
        max_rebl += Math.abs(questions[i].effect.rebl)
        max_mark += Math.abs(questions[i].effect.mark)
    }
    init_question();
}

function init_question() {
    document.getElementById("question-text").innerHTML = questions[qn].question;
    document.getElementById("question-number").innerHTML = "Question " + (qn + 1) + " of " + (questions.length);
    if (prev_answer == null) {
        document.getElementById("back_button").style.display = 'none';
        document.getElementById("back_button_off").style.display = 'block';
    } else {
        document.getElementById("back_button").style.display = 'block';
        document.getElementById("back_button_off").style.display = 'none';
    }

}

function next_question(mult) {
    radi += mult*questions[qn].effect.radi
    coop += mult*questions[qn].effect.coop
    ownr += mult*questions[qn].effect.ownr
    glob += mult*questions[qn].effect.glob
    prog += mult*questions[qn].effect.prog
    rebl += mult*questions[qn].effect.rebl
    mark += mult*questions[qn].effect.mark
    qn++;
    prev_answer = mult;
    if (qn < questions.length) {
        init_question();
    } else {
        results();
    }
}
function prev_question() {
    if (prev_answer == null) {
        return;
    }
    qn--;
    radi -= prev_answer * questions[qn].effect.radi;
    coop -= prev_answer * questions[qn].effect.coop;
    ownr -= prev_answer * questions[qn].effect.ownr;
    glob -= prev_answer * questions[qn].effect.glob;
    prog -= prev_answer * questions[qn].effect.prog;
    rebl -= prev_answer * questions[qn].effect.rebl;
    mark -= prev_answer * questions[qn].effect.mark;
    prev_answer = null;
    init_question();

}
function calc_score(score,max) {
    return (100*(max+score)/(2*max)).toFixed(1)
}
function results() {
    location.href = `results.html`
        + `?r=${calc_score(radi,max_radi)}`
        + `&c=${calc_score(coop,max_coop)}`
        + `&o=${calc_score(ownr,max_ownr)}`
        + `&g=${calc_score(glob,max_glob)}`
        + `&p=${calc_score(prog,max_prog)}`
        + `&l=${calc_score(rebl,max_rebl)}`
        + `&m=${calc_score(mark,max_mark)}`
}