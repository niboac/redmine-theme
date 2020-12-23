$(document).ready(function() {
  localStorage.getItem("myName");
  var kingDueDaysObj = {'1天后': 1, '2天后': 2, '3天后': 3, '4天后': '4', '5天后': 5, '1周后': 7, '2周后': 14, '3周后': 21, '4周后': 28,
    '5周后': 35, '6周后': 42, '7周后': 49, '2月后': 60, '3月后': 90};

  $('#content #update').show();

  document.querySelectorAll('.issues.list tr td.status').forEach(item => {
    // 替换表格每行的颜色
    if ($(item).text() == 'New') {
      $(item).parent().find('a').css('color', 'green');
      $(item).css('color', 'green');
    }

    if ($(item).text() == 'Resolved') {
      $(item).parent().find('a').css('color', '#B859DB');
      $(item).css('color', '#B859DB');
    }

    if ($(item).text() == 'In Progress') {
      $(item).parent().find('a').css('color', '#169');
      $(item).css('color', '#169');
    }

    if ($(item).text() == 'Feedback') {
      $(item).parent().find('a').css('color', '#999');
      $(item).css('color', '#999');
    }

    if ($(item).text() == 'Rejected') {
      $(item).parent().find('a').css('text-decoration', 'line-through');
      $(item).parent().find('a').css('color', '#666');
      $(item).css('text-decoration', 'line-through');
    }

    if ($(item).text() == 'Closed') {
      $(item).parent().find('a:not(.js-contextmenu)').css({ 'color': '#eee', 'background': '#666' });
    }


  })

  document.querySelectorAll('.issues.list tr td.tracker').forEach(item => {
    // 将bug替换成图标
    if ($(item).text() == 'Bug') {
      $(item).text('🐞');
    }
  })

  document.querySelectorAll('.issues.list tr td.assigned_to a').forEach(item => {
    // 替换@我
    if ($(item).text() == localStorage.getItem("myName")) {
      $(item).html("<span style='color:red;'>@我️</span>");
    }
  })

  document.querySelectorAll('.issues.list tr td.priority').forEach(item => {
    // 高优先级的颜色为红色
    if ($(item).text() == 'High') {
      $(item).css('color', '#DB5959');
    }

    if ($(item).text() == 'Urgent') {
      $(item).css('color', 'red');
    }
  })

  // 点击某一行,右侧显示快捷菜单
  $(".issues.list tr" ).on("click", function() {
    console.log( $(this).find('td.id').text() );
    var currId = $(this).find('td.id').text();
    var currSubject = $(this).find('td.subject').html();
    getMyMenu(currId, currSubject)
    localStorage.setItem("currentId", currId);
    localStorage.setItem("currentSubject", currSubject);
  });

  // 记住上次点击的位置,右侧仍然显示上次的id
  var currentId = localStorage.getItem("currentId");
  var currentSubject = localStorage.getItem("currentSubject");
  if(currentId && currentSubject) {
    getMyMenu(currentId, currentSubject)
  }

  // 获取菜单列表
  function getMyMenu(id, currSubject) {
    var url = location.origin + '/issues/context_menu';
    var token = $('input[name=authenticity_token]').val();
    var data = 'authenticity_token=' + token +  "&ids[]=" + id;
    $.ajax({
      url: url,
      data: data,
      success: function(data, textStatus, jqXHR) {

        var textArea = '<textarea id="my-notes" rows="5" cols="36">\n' +
            '' +
            '</textarea><input type="submit" class="king-submit-note" name="commit" value="提交回复" onclick="writeMyNote('+id+')"><span class="king-submit-result"></span>'

        var html = '<div ></div><div style="border-top: 1px solid #ddd;width:100%;margin-top: 5px;"><b>['+id+']</b>'+currSubject + '</div>' + data + textArea
        if ( $("#action-box").length > 0 ) {
          $("#action-box").fadeOut(100);
          $("#action-box").html(html);
        } else {
          if ( $("#sidebar").length > 0 ) {
            $("#action-box").fadeOut(100);
            $('#sidebar').append('<div id="action-box" style="display: none;">'+html+'</div>')
          }
        }

        setTimeout(()=>{
          $("#action-box a:contains('类别')").parent().remove();
          $("#action-box a:contains('跟踪')").parent().remove();
          $("#action-box a:contains('目标版本')").parent().remove();
          $("#action-box a:contains('% 完成')").parent().find('li>a').each(function() {
            $(this).text($(this).text().replace('%', ''));

          })
          $("#action-box a.icon-fav-off").parent().remove();
          $("#action-box a.icon-del").parent().remove();
          $("#action-box a.icon-add").parent().parent().parent().remove();

          $("#action-box a:contains('指派给')").parent().find('li>a').on("click", function() {
            saveAssigns($(this).text())
          });

          $("#action-box a:contains('指派给')").parent().find('li>a:not(.disabled)').each(function() {
            var name = $(this).text();
            var arr = getAssigns();
            if(!arr.includes(name)) {
              $(this).css({'color': '#bbb'})
            }
          })

          setTimeout(() =>{
            $("#action-box").fadeIn(100);
          }, 20)

        },1)

      }
    });
  }


  function getAssigns() {
    return JSON.parse(localStorage.getItem("assignList") || '[]')
  }

  function saveAssigns(name) {
    let arr = getAssigns() || [];
    if(!arr.includes(name)) {
      arr.push(name);
      if(arr.length>8) {
        // 最多8个常用联系人
        arr.shift()
      }
    }
    localStorage.setItem("assignList", JSON.stringify(arr));
  }

  $('#tab-content-history .note-header').each(function (item) {
     var content = $(this).find('.user');
     var name = content.text();
     content.addClass('user-back' + (name.charCodeAt()%12));
     var time = $(this).find('a').eq(1);
     var detail = $(this).parent().find('.details');
     var wiki = $(this).parent().find('.wiki');
     time.css("float","right")
     detail.css("flex","1")
     wiki.css("flex","1")
     $(this).css("display","flex")
     $(this).html('');
     $(this).append(content);
     $(this).append(detail);
     $(this).append(wiki);
     $(this).append(time);
  })


})

function writeMyNote(id) {
  var url = location.origin + '/issues/'+id;
  var token = $('input[name=authenticity_token]').val();
  var form = new FormData();
  var note = $('#my-notes').val();
  form.append('utf8', '✓');
  form.append('_method', 'patch');
  form.append('authenticity_token', token);
  form.append('issue[notes]', note);
  $.ajax({
    url: url,
    type: 'POST',
    data: form,
    contentType: false,
    processData: false,
    cache: false,
    success: function(data, textStatus, jqXHR) {
      $('#my-notes').val('')
      $('.king-submit-result').html('<span style="color:red;padding-left: 20px;">发布成功!</span>');
      setTimeout(() => {
        $('.king-submit-result').html('');
      }, 3000)
    }
  }).fail(function(err) {
    console.log(err);
  });
}


function myIssueDueDate() {
  var now = new Date().valueOf();
  var newDate = new Date(now + kingDueDaysObj[due]*24*3600*1000);
  return newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
}
