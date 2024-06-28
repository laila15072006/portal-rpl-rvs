var all_questions = [{
    question_string: "Berapa tools di bawah ini yang perlu disiapkan untuk membuat dan menjalankan HTML,kecuali?",
    choices: {
      correct: "Terminal",
      wrong: ["Browser", "Text Editor", "Visual Studio Code"]
    }
  }, {
    question_string: "Dibawah ini adalah alasan mengapa menggunakan semantic HTML,kecuali?",
    choices: {
      correct: "Wajib Digunakan",
      wrong: ["Accessibility", "SEO", "Mudah dibaca dan dipahami"]
    }
  }, {
    question_string: "Dibawah ini alasan mengapa perlu mempertimbangkan komunitas saat memilih dan menggunakan suatu bahasa pemprograman,kecuali?",
    choices: {
      correct: "Teknologi terbaru",
      wrong: ["Mudah mencari solusi saat menemukan error atau bug", "Dibutuhkan oleh perusahaan-perusahaan dan startup", "Sudah valid dan stabil"]
    }
  }, {
    question_string: 'Ada 3 cara dalam menggunakan CSS pada file HTML.Di bawah ini yang bukan termasuk dalam ketiga cara tersebut adalah? ',
    choices: {
      correct: ".style Files",
      wrong: ["Inline Styles", "The Tag", ".CSS Files"]
    }
  }, {
    question_string: 'Di bawah ini yang termasuk bahasa pemprograman?',
    choices: {
      correct: "JavaScript",
      wrong: ["Console", "CSS", "HTML"]
    }
  }];
  var Quiz = function(quiz_name) {
    this.quiz_name = quiz_name;
    this.questions = [];
  }
  Quiz.prototype.add_question = function(question) {
    var index_to_add_question = Math.floor(Math.random() * this.questions.length);
    this.questions.splice(index_to_add_question, 0, question);
  }
  Quiz.prototype.render = function(container) {
    var self = this;
    $('#quiz-results').hide();
    $('#quiz-name').text(this.quiz_name);
    var question_container = $('<div>').attr('id', 'question').insertAfter('#quiz-name');
    function change_question() {
      self.questions[current_question_index].render(question_container);
      $('#prev-question-button').prop('disabled', current_question_index === 0);
      $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);
      var all_questions_answered = true;
      for (var i = 0; i < self.questions.length; i++) {
        if (self.questions[i].user_choice_index === null) {
          all_questions_answered = false;
          break;
        }
      }
      $('#submit-button').prop('disabled', !all_questions_answered);
    }
    var current_question_index = 0;
    change_question();
    $('#prev-question-button').click(function() {
      if (current_question_index > 0) {
        current_question_index--;
        change_question();
      }
    });
   
    $('#next-question-button').click(function() {
      if (current_question_index < self.questions.length - 1) {
        current_question_index++;
        change_question();
      }
    });
    $('#submit-button').click(function() {
      var score = 0;
      for (var i = 0; i < self.questions.length; i++) {
        if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) {
          score++;
        }
      }
      var percentage = score / self.questions.length;
      console.log(percentage);
      var message;
      if (percentage === 1) {
        message = 'Great job!'
      } else if (percentage >= .75) {
        message = 'You did alright.'
      } else if (percentage >= .5) {
        message = 'Better luck next time.'
      } else {
        message = 'Maybe you should try a little harder.'
      }
      $('#quiz-results-message').text(message);
      $('#quiz-results-score').html('You got <b>' + score + '/' + self.questions.length + '</b> questions correct.');
      $('#quiz-results').slideDown();
      $('#quiz button').slideUp();
    });
    question_container.bind('user-select-change', function() {
      var all_questions_answered = true;
      for (var i = 0; i < self.questions.length; i++) {
        if (self.questions[i].user_choice_index === null) {
          all_questions_answered = false;
          break;
        }
      }
      $('#submit-button').prop('disabled', !all_questions_answered);
    });
  }
  
  var Question = function(question_string, correct_choice, wrong_choices) {
    // Private fields for an instance of a Question object.
    this.question_string = question_string;
    this.choices = [];
    this.user_choice_index = null; // Index of the user's choice selection
    
    // Random assign the correct choice an index
    this.correct_choice_index = Math.floor(Math.random() * wrong_choices.length + 1);
    
    // Fill in this.choices with the choices
    var number_of_choices = wrong_choices.length + 1;
    for (var i = 0; i < number_of_choices; i++) {
      if (i === this.correct_choice_index) {
        this.choices[i] = correct_choice;
      } else {
        // Randomly pick a wrong choice to put in this index
        var wrong_choice_index = Math.floor(Math.random(0, wrong_choices.length));
        this.choices[i] = wrong_choices[wrong_choice_index];
        
        // Remove the wrong choice from the wrong choice array so that we don't pick it again
        wrong_choices.splice(wrong_choice_index, 1);
      }
    }
  }
  
  Question.prototype.render = function(container) {
  
    var self = this;
    
  
    var question_string_h2;
    if (container.children('h2').length === 0) {
      question_string_h2 = $('<h2>').appendTo(container);
    } else {
      question_string_h2 = container.children('h2').first();
    }
    question_string_h2.text(this.question_string);
    
  
    if (container.children('input[type=radio]').length > 0) {
      container.children('input[type=radio]').each(function() {
        var radio_button_id = $(this).attr('id');
        $(this).remove();
        container.children('label[for=' + radio_button_id + ']').remove();
      });
    }
    for (var i = 0; i < this.choices.length; i++) {
      var choice_radio_button = $('<input>')
        .attr('id', 'choices-' + i)
        .attr('type', 'radio')
        .attr('name', 'choices')
        .attr('value', 'choices-' + i)
        .attr('checked', i === this.user_choice_index)
        .appendTo(container);
      
  
      var choice_label = $('<label>')
        .text(this.choices[i])
        .attr('for', 'choices-' + i)
        .appendTo(container);
    }
    
    
    $('input[name=choices]').change(function(index) {
      var selected_radio_button_value = $('input[name=choices]:checked').val();
      
   
      self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));
      
    
      container.trigger('user-select-change');
    });
  }
  
  
  $(document).ready(function() {
  
    var quiz = new Quiz('');
    
    for (var i = 0; i < all_questions.length; i++) {
  
      var question = new Question(all_questions[i].question_string, all_questions[i].choices.correct, all_questions[i].choices.wrong);
  
      quiz.add_question(question);
    }
  
    var quiz_container = $('#quiz');
    quiz.render(quiz_container);
  });