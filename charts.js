Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  },
  chart: {
    style: {
      fontFamily: 'Open Sans'
    }
  }
});

var lines, items,
  arr_ditems = [],
  arr_data_broad = [],
  arr_data_detailed = [],
  arr_text_broad = [],
  arr_text_detailed = [],
  curr_domain, curr_element, str_type,
  curr_data_scatter, curr_data_bar, curr_data_scatter2,
  curr_xcat = [],
  curr_scatter_series_name = {}, curr_scatter2_series_name = {}, curr_bar_series_name = {},
  curr_scatter_series = [], curr_scatter2_series = [], curr_bar_series = [],
  temp, j, k;

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

function create_dmenu (datain, ptext) {
  var i, temp = [], text;
  arr_ditems = [];
  $.each(datain, function (i, item) {
    if ((arr_ditems.indexOf(item.element_name) === -1) && (typeof(item.element_name) !== "undefined")) {
      arr_ditems.push(item.element_name);
    }
  });
  text = $.grep(ptext, function (n,i) {
    return n.domain === curr_domain;
  });
  curr_element = arr_ditems[0];
  for (i=0; i<arr_ditems.length; i=i+1) {
    if (typeof(text[i]) !== "undefined") {
      temp.push({'element_name': arr_ditems[i], 'desc': text[i]['desc']});
    }
  };
  temp.sort(function (a,b) {
    return a.element_name < b.element_name ? -1 : 1;
  });
  $('#dmenu').empty();
  for (i in arr_ditems) {
    if (typeof(temp[i]) !== "undefined") {
    if (temp[i]['element_name'] === curr_element) {
      $('#dmenu').append(
        $('<li>').attr("class", "list-group-item active").attr("data-toggle", "list").append(
          $('<a>').attr("class", "d-element").attr("title", temp[i]['desc']).append(
            temp[i]['element_name'])
          )
       )}
       else {
         $('#dmenu').append(
           $('<li>').attr("class", "list-group-item").attr("data-toggle", "list").append(
             $('<a>').attr("class", "d-element").attr("title", temp[i]['desc']).append(
               temp[i]['element_name'])
             )
          )};
        }
      }
}

function switchDomain (filename) {
  if (str_type === "Broad") {
    $.get(filename, function (data, status) {
      lines = data.split('\n');
      $.each(lines, function (lineNo, line) {
        line = line.replace(/(\r\n|\n|\r)/gm, "");
        items = line.split('\t');
        if (lineNo > 0) {
          pushDataBroad(arr_data_broad, items);
        }
      });
      create_dmenu(arr_data_broad, arr_text_broad);
      scatterChart(curr_element, arr_data_broad);
      barChart(curr_element, arr_data_broad);
      scatterChart2(curr_element, arr_data_broad);
      $(".d-element").on('click', function () {
        curr_element = $(this).text().trim();
        scatterChart(curr_element, arr_data_broad);
        barChart(curr_element, arr_data_broad);
        scatterChart2(curr_element, arr_data_broad);
      });
    });
  } else if (str_type === "Detailed") {
      $.get(filename, function (data, status) {
        lines = data.split('\n');
        $.each(lines, function (lineNo, line) {
          line = line.replace(/(\r\n|\n|\r)/gm, "");
          items = line.split('\t');
          if (lineNo > 0) {
            pushDataDetailed(arr_data_detailed, items);
          }
        });
        create_dmenu(arr_data_detailed, arr_text_detailed);
        scatterChart(curr_element, arr_data_detailed);
        barChart(curr_element, arr_data_detailed);
        scatterChart2(curr_element, arr_data_detailed);
        $(".d-element").on('click', function () {
          curr_element = $(this).text().trim();
          scatterChart(curr_element, arr_data_detailed);
          barChart(curr_element, arr_data_detailed);
          scatterChart2(curr_element, arr_data_detailed);
        });
      });
    }
}

function switchType () {
  if (str_type === "Broad") {
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
  } else if (str_type === "Detailed") {
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

function scatterChart(pelement, pdata) {
  var colorpalette1 = ["#E8D4F7", '#700CBC', '#FDED2A', '#B8AA14', '#343009'];
  curr_scatter_series = [];
  curr_data_scatter = $.grep(pdata, function (n, i) {
    return n.element_name === pelement && n.type === "1";
  });
  for (j=1; j<6; j=j+1) {
    temp = $.grep(curr_data_scatter, function (n, i) {
      return n.jobzone === j;
    });
    curr_scatter_series_name = {'name': 'Job zone ' + j, 'color': colorpalette1[j-1], 'data': []};
    $.each(temp, function (i, item) {
      curr_scatter_series_name['data'].push({'x': item.avg_scale, 'y': item.annual_earn,
        'name': item.soc_title, 'jobzone': item.jobzone, 'competency': pelement});
    })
    curr_scatter_series.push(curr_scatter_series_name);
  }
  $('#hcharts1').highcharts({
    title: {
      style: {
        color: "#696969",
        fontFamily: 'PT Serif Caption'
      },
      text: pelement + " score and earnings"
    },
    subtitle: {
      text: "Detailed occupations"
    },
    chart: {
      type: 'scatter'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Average score'
      },
      min: 0,
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true
    },
    yAxis: {
      title: {
        text: 'Annual earnings'
      }
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 3,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.name}: <br>Score: {point.x: .1f}, <br>Annual earnings: ${point.y}, <br>Competency: {point.competency}'
        }
      }
    },
    series: curr_scatter_series,
    credits: {
      enabled: false
    }
  });
}

function barChart(pelement, pdata) {
  var labels = ["Top quartile", "2nd quartile", "3rd quartile", "Bottom quartile"],
    colorpalette2 = ["#B2D732", "#66B032", "#347B98", "#092834"];
  // colorpalette2.reverse();
  // labels.reverse();
  curr_xcat = ["Job zone 1", "Job zone 2", "Job zone 3", "Job zone 4", "Job zone 5"];
  curr_bar_series = [];
  curr_data_bar = $.grep(pdata, function (n, i) {
    return n.element_name === pelement && n.type === "0";
  });
  for (j=3; j>-1; j=j-1) {
    temp = $.grep(curr_data_bar, function (n, i) {
      return n.rank_scale === String(j);
    });
    curr_bar_series_name = {'name': labels[j], 'data':[], 'color': colorpalette2[j]};
    $.each(temp, function (i, item) {
      curr_bar_series_name['data'].push({'y': item.annual_earn, 'score': item.avg_scale, 'competency': pelement});
    })
    curr_bar_series.push(curr_bar_series_name);
  }
  $('#hcharts2').highcharts({
    title: {
      style: {
        color: "#696969",
        fontFamily: 'PT Serif Caption'
      },
      text: "Annual earnings by score quartiles and job zone: " + pelement
    },
    chart: {
      type: 'column'
    },
    xAxis: {
      categories: curr_xcat
    },
    yAxis: {
      title: {
        text: null
      },
      gridLineColor: 'transparent',
      labels: {
        /* format: '{value:,.0f}' */
        enabled: true
      }
    },
    tooltip: {
      pointFormatter: function () {
        return this.series.name + ": $" + Highcharts.numberFormat(Math.round(this.y/1000) * 1000, 0) + '<br> Score: ' +
          Highcharts.numberFormat(Math.round(this.score * 10, 0)/10, 1);
      }
    },
    legend: {
      enabled: true,
      symbolRadius: 0
    },
    plotOptions: {
      series: {
        groupPadding: 0.1,
        dataLabels: {
          enabled: false
        }
      }
    },
    series: curr_bar_series,
    credits: {
      enabled: false
    }
  });
}

function scatterChart2(pelement, pdata) {
  curr_scatter2_series = [];
  curr_data_scatter2 = $.grep(pdata , function (n, i) {
    return n.element_name === pelement && n.type === "2";
  });
  temp = $.grep(curr_data_scatter2, function (n,i) {
    return n.soc_title === 'Farming, fisheries, and forestry' ||
      n.soc_title === 'Construction and extraction' ||
      n.soc_title === 'Installation, maintenance and repair' ||
      n.soc_title === 'Production' ||
      n.soc_title === 'Transportation and material moving';
  });
  curr_scatter2_series_name = {'name': 'Blue-collar', 'color': '#133863', 'data': []};
  $.each(temp, function (i, item) {
    curr_scatter2_series_name['data'].push({'x': item.avg_scale, 'y': item.annual_earn,
      'name': item.soc_title, 'element_name': pelement});
  });
  curr_scatter2_series.push(curr_scatter2_series_name);
  temp = $.grep(curr_data_scatter2, function (n,i) {
    return !(n.soc_title === 'Farming, fisheries, and forestry' ||
      n.soc_title === 'Construction and extraction' ||
      n.soc_title === 'Installation, maintenance and repair' ||
      n.soc_title === 'Production' ||
      n.soc_title === 'Transportation and material moving');
  });
  curr_scatter2_series_name = {'name': 'White-collar', 'color': '#C8C8C8', 'data': []};
  $.each(temp, function (i, item) {
    curr_scatter2_series_name['data'].push({'x': item.avg_scale, 'y': item.annual_earn,
      'name': item.soc_title, 'element_name': pelement});
  })
  curr_scatter2_series.push(curr_scatter2_series_name);
  $('#hcharts3').highcharts({
    title: {
      style: {
        color: "#696969",
        fontFamily: 'PT Serif Caption'
      },
      text: pelement + " score and earnings"
    },
    subtitle: {
      text: "Major occupations"
    },
    chart: {
      type: 'scatter'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Average score'
      },
      min: 0,
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true
    },
    yAxis: {
      title: {
        text: 'Annual earnings'
      }
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '<em>{point.element_name}</em> <br> {point.name}: Score: {point.x: .1f}, <br>Annual earnings: ${point.y}'
        }
      }
    },
    series: curr_scatter2_series,
    credits: {
      enabled: false
    }
  });
}

$(document).ready(function () {
  'use strict';

  $.get("ContentModel_DetailedDesc_broad.txt", function (data, status) {
    lines = data.split('\n');
    $.each(lines, function (lineNo, line) {
      line = line.replace(/(\r\n|\n|\r)/gm, "");
      line = line.replace(/"/gm,"");
      items = line.split('\t');
      if (lineNo > 0) {
        arr_text_broad.push({'domain': items[0], 'element_id': items[1], 'element_name': items[2], 'desc': items[3]});
      }
    });

    $.get('abilities_earn_broad.tsv', function (data, status) {
      lines = data.split('\n');
      $.each(lines, function (lineNo, line) {
        line = line.replace(/(\r\n|\n|\r)/gm, "");
        items = line.split('\t');
        if (lineNo > 0) {
          pushDataBroad(arr_data_broad, items);
        }
      });

      //Initialize
      curr_domain = 'Abilities';
      str_type = "Broad";
      $("#broad").addClass("active");
      create_dmenu(arr_data_broad, arr_text_broad);
      barChart(curr_element, arr_data_broad);
      scatterChart2(curr_element, arr_data_broad);
      scatterChart(curr_element, arr_data_broad);

      $("#detailed").on('click', function () {
        str_type = "Detailed";
        $("#detailed").addClass("active");
        $("#broad").removeClass("active");
        $.get("ContentModel_DetailedDesc_group.txt", function (data, status) {
          lines = data.split('\n');
          $.each(lines, function (lineNo, line) {
            line = line.replace(/(\r\n|\n|\r)/gm, "");
            line = line.replace(/"/gm,"");
            items = line.split('\t');
            if (lineNo > 0) {
              arr_text_detailed.push({'domain': items[0], 'element_id': items[1], 'element_name': items[2], 'desc': items[3]});
            }
          });
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
      });

      $("#broad").on('click', function () {
        str_type = "Broad";
        $("#detailed").removeClass("active");
        $("#broad").addClass("active");
        arr_data_broad = [];
        create_dmenu(arr_data_broad, arr_text_broad);
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

        $(".d-element").on('click', function () {
          curr_element = $(this).text().trim();
          scatterChart(curr_element, arr_data_broad);
          barChart(curr_element, arr_data_broad);
          scatterChart2(curr_element, arr_data_broad);
        });
        $(".domain-list").on('click', function () {
          curr_domain = $(this).text().trim();
          switchType();
        });
      });

      $(".d-element").on('click', function () {
        curr_element = $(this).text().trim();
        scatterChart(curr_element, arr_data_broad);
        barChart(curr_element, arr_data_broad);
        scatterChart2(curr_element, arr_data_broad);
      });
      $(".domain-list").on('click', function () {
        curr_domain = $(this).text().trim();
        switchType();
      });
    });
  });
});
