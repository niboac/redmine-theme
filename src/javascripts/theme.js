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


  // 点击某一行
  $(".issues.list tr" ).on("click", function() {
    console.log( $(this).find('td.id').text() );
    var currId = $(this).find('td.id').text();

    var statusAction = '/issues/bulk_update?back_url=' + encodeURIComponent('/projects/syh/issues?c[]=tracker&c[]=status&c[]=priority&c[]=subject&c[]=assigned_to&c[]=updated_on&c[]=done_ratio&c[]=author&f[]=status_id&f[]=assigned_to_id&f[]=&group_by=category&op[assigned_to_id]==&op[status_id]=!&set_filter=1&sort=id:desc&t[]=&v[assigned_to_id][]=me&v[status_id][]=5&ids[]='+currId+'&issue[status_id]=')
    var statusLink = '<ul>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'1">New</a></li>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'2">In Progress</a></li>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'3">Resolved</a></li>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'4">Feedback</a></li>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'5">Closed</a></li>\n' +
        '        <li><a class="" rel="nofollow" data-method="post" href="'+statusAction+'6">Rejected</a></li>\n' +
        '    </ul>'
    if ( $("#action-box").length > 0 ) {
      $("#action-box").html(statusLink);
    } else {
      $('#sidebar').append('<div id="action-box">'+statusLink+'</div>')
    }

  });

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


  function getMyMenu(id=33) {
    var url = location.origin + '/redmine4/issues/context_menu';
    var token = $('input[name=authenticity_token]').val();
    var data = 'authenticity_token=' + token +  "&ids[]=" + id;
    $.ajax({
      url: url,
      data: data,
      success: function(data, textStatus, jqXHR) {
        $('#sidebar').html(data);

        var textArea = '<textarea id="my-notes" rows="10" cols="30">\n' +
            '' +
            '</textarea><input type="submit" name="commit" value="提交" onclick="writeMyNote('+id+')">'

      }
    });
  }
  getMyMenu(33)


  function writeMyNote(id=33) {
    var url = location.origin + '/redmine4/issues/33';
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
      success: function(data, textStatus, jqXHR) {
        $('#sidebar').html(data);

      }
    });
  }


})
