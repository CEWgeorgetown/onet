Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  },
  tooltip: {
    decimalPoint: 1
  },
  chart: {
    style: {
      fontFamily: 'Open Sans'
    }
  }
});

var lines, items, arr_data_detailed = [], arr_data_broad = [],
  curr_type, curr_domain, curr_occupation, curr_heatmap_data,
  curr_heatmap_series_name = [], curr_xcat, curr_ycat, curr_bar_cat;

function pushDataBroad(dobj, things) {
  'use strict';
  dobj.push({
    'soc_code': things[0],
    'element_name': things[1],
    'avg_scale': parseFloat(things[2]),
    'tot_emp': parseFloat(things[3]),
    'soc2': things[4],
    'annual_earn': parseFloat(things[5]),
    'rank_scale': things[6],
    'soc_title': things[7],
    'jobzone': parseInt(things[8]),
    'type': things[9]
  });
}
function pushDataDetailed(dobj, things) {
  'use strict';
  dobj.push({
    'soc_code': things[0],
    'element_id': things[1],
    'element_name': things[2],
    'avg_scale': parseFloat(things[3]),
    'tot_emp': parseFloat(things[4]),
    'soc2': things[5],
    'annual_earn': parseFloat(things[6]),
    'rank_scale': things[7],
    'soc_title': things[8],
    'jobzone': parseInt(things[9]),
    'type': things[10]
  });
}

function pushData(dobj, things) {
  'use strict';
  dobj.push({
    'soc_code': things[0],
    'element_id': things[1],
    'element_name': things[2],
    'avg_scale': parseFloat(things[3]),
    'tot_emp': parseFloat(things[4]),
    'soc2': things[5],
    'annual_earn': parseFloat(things[6]),
    'rank_scale': things[7],
    'soc_title': things[8],
    'jobzone': parseInt(things[9]),
    'type': things[10]
  });
}

function heatChart (pdata) {
  var temp;
  curr_heatmap_data = $.grep(pdata, function (n,i) {
      return n.soc2 === curr_occupation;
  });
  curr_heatmap_series = [];
  curr_xcat = [];
  curr_ycat = [];
  curr_bar_cat = [];
  /* Set turboThreshold to 0 otherwise axes extends beyond and colors become black */
  curr_heatmap_series_name = {'name': curr_domain, 'turboThreshold': 0, 'data': []};
  $.each(curr_heatmap_data, function (i, item) {
    if ((curr_xcat.indexOf(item.element_name) === -1) && (typeof(item.element_name) !== "undefined")) {
      curr_xcat.push(item.element_name);
    };
    if ((curr_ycat.indexOf(item.soc_title) === -1) && (typeof(item.soc_title) !== "undefined")) {
      curr_ycat.push(item.soc_title);
      curr_bar_cat.push(item.annual_earn);
    };
  });
  curr_ycat.reverse();
  curr_bar_cat.reverse();
  if ((curr_domain === 'Work activities') || (curr_domain === 'Work context')) {
    if (curr_ycat.length < 25) {
      $("#hcharts4").css("height", "800px");
      $("#hcharts4a").css("height", "500px");
    } else if (curr_ycat.length < 50) {
      $("#hcharts4").css("height", "1100px");
      $("#hcharts4a").css("height", "800px");
    } else if (curr_ycat.length < 75) {
      $("#hcharts4").css("height", "1400px");
      $("#hcharts4a").css("height", "1100px");
    } else if (curr_ycat.length < 100) {
      $("#hcharts4").css("height", "1700px");
      $("#hcharts4a").css("height", "1400px");
    } else {
      $("#hcharts4").css("height", "2300px");
      $("#hcharts4a").css("height", "2000px");
    }
} else {
  if (curr_ycat.length < 25) {
    $("#hcharts4").css("height", "600px");
    $("#hcharts4a").css("height", "480px");
  } else if (curr_ycat.length < 50) {
    $("#hcharts4").css("height", "900px");
    $("#hcharts4a").css("height", "780px");
  } else if (curr_ycat.length < 75) {
    $("#hcharts4").css("height", "1200px");
    $("#hcharts4a").css("height", "1080px");
  } else if (curr_ycat.length < 100) {
    $("#hcharts4").css("height", "1500px");
    $("#hcharts4a").css("height", "1380px");
  } else {
    $("#hcharts4").css("height", "2100px");
    $("#hcharts4a").css("height", "1980px");
  }
}
  for (y = 0; y < curr_ycat.length; y = y + 1) {
    temp = $.grep(curr_heatmap_data, function (n, i) {
      return n.soc_title === curr_ycat[y];
    });
    $.each(temp, function (x, item) {
      curr_heatmap_series_name['data'].push([x, y, item.avg_scale]);
    });
  };
  $('#hcharts4').highcharts({
    chart: {
      type: 'heatmap'
    },
    title: {
      text: curr_domain + " and " + curr_occupation + " occupations: average scores"
    },
    xAxis: {
      categories: curr_xcat
    },
    yAxis: {
      title: null,
      categories: curr_ycat
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#110934'
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'middle',
      y: 25,
      symbolHeight: 280
    },
    tooltip: {
      formatter: function () {
          return '<b>' + this.series.yAxis.categories[this.point.y] + ':</b><br>' + this.series.xAxis.categories[this.point.x] + ' score: ' +
              Highcharts.numberFormat(this.point.value,1);
      }
    },
    credits: {
      enabled: false
    },
    series: [curr_heatmap_series_name]
  });

  $('#hcharts4a').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: "Earnings"
    },
    xAxis: {
      categories: curr_ycat,
      labels: {
        enabled: false
      },
      tickLength: 0,
      reversed: false
    },
    yAxis: {
      title: null,
      labels: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: '${point.y}'
    },
    plotOptions: {
      series: {
        pointPadding: 0.1,
        groupPadding: 0.1,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '${y:,1f}',
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [{'name': curr_occupation, 'color': '#347B98', 'data': curr_bar_cat}]
  });
};

function switchDomain (filename) {
  if (curr_type === "Broad") {
    $.get(filename, function (data, status) {
      lines = data.split('\n');
      $.each(lines, function (lineNo, line) {
        line = line.replace(/(\r\n|\n|\r)/gm, "");
        items = line.split('\t');
        if (lineNo > 0) {
          pushDataBroad(arr_data_broad, items);
        }
      });
      arr_data_broad = $.grep(arr_data_broad, function (n, i) {
        return n.type === '1'
      });
      heatChart(arr_data_broad);
      $(".occ-list").on('click', function () {
        curr_occupation = $(this).text().trim();
        heatChart(arr_data_broad);
      });
    });
  } else if (curr_type === "Detailed") {
    $.get(filename, function (data, status) {
      lines = data.split('\n');
      $.each(lines, function (lineNo, line) {
        line = line.replace(/(\r\n|\n|\r)/gm, "");
        items = line.split('\t');
        if (lineNo > 0) {
          pushDataDetailed(arr_data_detailed, items);
        }
      });
      arr_data_detailed = $.grep(arr_data_detailed, function (n, i) {
        return n.type === '1'
      });
      heatChart(arr_data_detailed);
      $(".occ-list").on('click', function () {
        curr_occupation = $(this).text().trim();
        heatChart(arr_data_detailed);
      });
    });
  };
};

function switchType () {
  if (curr_type === "Broad") {
    arr_data_broad = [];
    if (curr_domain === "Knowledge") {
      switchDomain("knowledge_earn_broad.tsv");
    } else if (curr_domain === "Skills") {
      switchDomain("skills_earn_broad.tsv");
    } else if (curr_domain === "Work activities") {
      switchDomain("activities_earn_broad.tsv");
    } else if (curr_domain === "Work context") {
      switchDomain("context_earn_broad.tsv");
    } else if (curr_domain === "Work styles") {
      switchDomain("styles_earn_broad.tsv");
    } else if (curr_domain === "Abilities") {
      switchDomain("abilities_earn_broad.tsv");
    };
  } else if (curr_type === "Detailed") {
    arr_data_detailed = [];
    if (curr_domain === "Knowledge") {
       switchDomain("knowledge_earn.tsv");
     } else if (curr_domain === "Skills") {
       switchDomain("skills_earn.tsv");
     } else if (curr_domain === "Work activities") {
       switchDomain("activities_earn.tsv");
     } else if (curr_domain === "Work context") {
       switchDomain("context_earn.tsv");
     } else if (curr_domain === "Work styles") {
       switchDomain("styles_earn.tsv");
     } else if (curr_domain === "Abilities") {
       switchDomain("abilities_earn.tsv");
     };
  }
}

$(document).ready(function () {
  'use strict';

  $.get('abilities_earn_broad.tsv', function (data, status) {
    lines = data.split('\n');
    $.each(lines, function (lineNo, line) {
      line = line.replace(/(\r\n|\n|\r)/gm, "");
      items = line.split('\t');
      if (lineNo > 0) {
        pushDataBroad(arr_data_broad, items);
      }
    });
    arr_data_broad = $.grep(arr_data_broad, function (n, i) {
      return n.type === '1'
    });
    $("#broad").addClass("active");
    curr_type = "Broad";
    curr_occupation = "Management";
    curr_domain = "Abilities";
    heatChart(arr_data_broad);

    $("#detailed").on('click', function () {
      $("#detailed").addClass("active");
      $("#broad").removeClass("active");
      curr_type = "Detailed";
      arr_data_detailed = [];
      if (curr_domain === "Knowledge") {
         switchDomain("knowledge_earn.tsv");
       } else if (curr_domain === "Skills") {
         switchDomain("skills_earn.tsv");
       } else if (curr_domain === "Work activities") {
         switchDomain("activities_earn.tsv");
       } else if (curr_domain === "Work context") {
         switchDomain("context_earn.tsv");
       } else if (curr_domain === "Work styles") {
         switchDomain("styles_earn.tsv");
       } else if (curr_domain === "Abilities") {
         switchDomain("abilities_earn.tsv");
       };
    });
    $("#broad").on('click', function () {
      $("#broad").addClass("active");
      $("#detailed").removeClass("active");
      curr_type = "Broad";
      arr_data_broad = [];
      if (curr_domain === "Knowledge") {
        switchDomain("knowledge_earn_broad.tsv");
      } else if (curr_domain === "Skills") {
        switchDomain("skills_earn_broad.tsv");
      } else if (curr_domain === "Work activities") {
        switchDomain("activities_earn_broad.tsv");
      } else if (curr_domain === "Work context") {
        switchDomain("context_earn_broad.tsv");
      } else if (curr_domain === "Work styles") {
        switchDomain("styles_earn_broad.tsv");
      } else if (curr_domain === "Abilities") {
        switchDomain("abilities_earn_broad.tsv");
      };
    });

    $(".domain-list").on('click', function () {
      curr_domain = $(this).text().trim();
      switchType();
    });
  });

})
