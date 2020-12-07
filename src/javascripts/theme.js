$(document).ready(function() {
  localStorage.getItem("myName");

  document.querySelectorAll('.issues.list tr td.status').forEach(item => {

    if ($(item).text() == 'New') {
      $(item).parent().find('a').css('color', 'green');
      $(item).css('color', 'green');
    }

    if ($(item).text() == 'Resolved') {
      $(item).parent().find('a').css('color', '#B859DB');
      $(item).css('color', '#B859DB');
    }

    if ($(item).text() == 'In Progress') {
      $(item).parent().find('a').css('color', '#5EC6DB');
      $(item).css('color', '#5EC6DB');
    }

    if ($(item).text() == 'Feedback') {
      $(item).parent().find('a').css('color', '#aaa');
      $(item).css('color', '#aaa');
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

    if ($(item).text() == 'Bug') {
      $(item).text('🐞');
    }
  })

  document.querySelectorAll('.issues.list tr td.assigned_to a').forEach(item => {

    if ($(item).text() == localStorage.getItem("myName")) {
      $(item).html("<span style='color:red;'>@我️</span>");
    }
  })

  document.querySelectorAll('.issues.list tr td.priority').forEach(item => {
    if ($(item).text() == 'High') {
      $(item).css('color', '#DB5959');
    }

    if ($(item).text() == 'Urgent') {
      $(item).css('color', 'red');
    }
  })


  $("a.no-jump").each(function () {
    $(this).attr('href');     //修改<a>的 href属性值为 #  这样状态栏不会显示链接地址
    $(this).click(function (event) {
      event.preventDefault();   // 如果<a>定义了 target="_blank“ 需要这句来阻止打开新页面
    });
  });
  /**
   * /redmine4/issues/bulk_update?back_url=/redmine4/issues&ids[]=33&issue[status_id]=18
   * /redmine4/issues/bulk_update?back_url=/redmine4/issues&ids[]=33&issue[assigned_to_id]=46
   * /redmine4/issues/bulk_update?back_url=/redmine4/issues&ids[]=33&issue[done_ratio]=20
   */


  // 点击某一行
  $(".issues.list tr" ).on("click", function() {
    console.log( $(this).find('td.id').text() );
    var currId = $(this).find('td.id').text();
    var currSubject = $(this).find('td.subject').html();
    getMyMenu(currId, currSubject)
    localStorage.setItem("currentId", currId);
    localStorage.setItem("currentSubject", currSubject);
  });
  var currentId = localStorage.getItem("currentId");
  var currentSubject = localStorage.getItem("currentSubject");
  if(currentId && currentSubject) {
    getMyMenu(currentId, currentSubject)
  }

  function getMyMenu(id, currSubject) {
    var url = location.origin + '/issues/context_menu';
    var token = $('input[name=authenticity_token]').val();
    var data = 'authenticity_token=' + token +  "&ids[]=" + id;
    $.ajax({
      url: url,
      data: data,
      success: function(data, textStatus, jqXHR) {

        var textArea = '<textarea id="my-notes" rows="10" cols="30">\n' +
            '' +
            '</textarea><input type="submit" name="commit" value="提交" onclick="writeMyNote('+id+')">'

        var html = '<div ></div><div style="border-top: 1px solid #ddd;width:100%;margin-top: 5px;"><b>['+id+']</b>'+currSubject + '</div>' + data + textArea
        if ( $("#action-box").length > 0 ) {
          $("#action-box").html(html);
        } else {
          if ( $("#sidebar").length > 0 ) {
            $('#sidebar').append('<div id="action-box">'+html+'</div>')
          }
        }

      }
    });
  }

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
      }
    }).fail(function(err) {
      console.log(err);
    });
  }


})
