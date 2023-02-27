document.addEventListener('DOMContentLoaded', () => {
  aShow = ['myCanvas', 'bottomLine'];
  document
    .querySelectorAll('[id]')
    .forEach(e => (!~aShow.indexOf(e.id) ? (e.hidden = true) : false));

  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.lineTo(100, 140);
  ctx.lineTo(0, 125);
  ctx.closePath();
  ctx.fill();

  var canvas = document.getElementById('bottomLine');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#EC1C3C';
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(150, 25);
  ctx.lineTo(150, 300);
  ctx.lineTo(50, 300);
  ctx.closePath();
  ctx.fill();
});

window.addEventListener('message', function(oEvent) {
  if (oEvent.data === 'print') {
    window.print();
    return;
  }
  var oData = JSON.parse(oEvent.data),
    oResume = oData.cur_resume,
    aFieldsForRender = [],
    aFields = oData.print_resume;
  aFields.forEach(function(parent) {
    if (parent.childs.length > 0) {
      parent.childs.forEach(function(child) {
        if (child.value === true) {
          aFieldsForRender.push(child.key);
        }
      });
    } else {
      if (parent.value === true) {
        aFieldsForRender.push(parent.key);
      }
    }
  });
  /*временное(надеюсь) решение,
   *переделываю архитектуру данных
   *под удобный мне формат
   */
  oResume = converter(oResume);

  for (var i in aFieldsForRender) {
    var field = aFieldsForRender[i],
      aPath = field.split('.'),
      value = oResume;
    for (var v = 0; v < aPath.length; v++) {
      value = value ? value[aPath[v]] : undefined;
    }
    showAllParents(aPath);
    var element = giveMe(aPath);
    switch (aPath[aPath.length - 1]) {
    case 'surname':
    case 'name':
    case 'patronymic':
    case 'birthday':
    case 'academicDegree':
    case 'position':
      element.innerText = value || 'н/д';
      break;
    case 'department':
      element.innerText = value || 'н/д';
      break;
    case 'firstDay':
      element.innerText = `В компании с ${value || 'н/д'}`;
      break;
    case 'educationalEstablishments':
      if (value && value.length) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.innerHTML = `
            <span>${e.yearStart} &#8211; ${e.yearGraduation}</span>
            <span class="mainName">${e.name}</span>
            <p style="font-size: 14px; color: darkcyan">${e.degree}, ${
  e.specialization
}</p>
            ${i !== arr.length - 1 ? '<hr>' : ''}`;
          element.appendChild(div);
        });
      } else {
        var p = document.createElement('p');
        p.innerText = 'н/д';
        element.appendChild(p);
      }
      break;
    case 'certificates':
      if (value && value.length) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.className = 'relative';
          div.innerHTML = `
            <span>${e.year}</span>
            <img class="sapIcon" src="https://png.icons8.com/color/1600/sap.png" alt="SAP" ${
  e.sap !== true ? 'hidden' : ''
}>
            <p style="margin-top: 1mm; word-wrap: break-word;">${e.name}</p>
            ${i !== arr.length - 1 ? '<hr>' : ''}`;
          element.appendChild(div);
        });
      } else {
        var p = document.createElement('p');
        p.innerText = 'н/д';
        element.appendChild(p);
      }
      break;
    case 'career':
      if (value && value.length) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.innerHTML = `
              <span>${e.yearStart} &#8211; ${e.yearLeave}</span>
              <span class="mainName">${e.companyName}</span>
              <p style="font-size: 14px; color: darkcyan">${e.position}</p>
              ${i !== arr.length - 1 ? '<hr>' : ''}`;
          element.appendChild(div);
        });
      } else {
        var p = document.createElement('p');
        p.innerText = 'н/д';
        element.appendChild(p);
      }
      break;
    case 'consultingExp':
      if (value)
        element.innerHTML = `<span>Опыт работы в консалтинге ${value}</span>`;
      else element.innerHTML = '<span>Опыт работы в консалтинге н/д</span>';
      break;
    case 'commonSkills':
      if (value) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.className = 'tag';
          div.innerText = e;
          element.appendChild(div);
        });
      } else {
        var div = document.createElement('div');
        div.innerText = 'н/д';
        element.children[1].appendChild(div);
      }
      break;
    case 'softSkills':
      if (value) {
        value.forEach(e =>
          element.children[1].tBodies[0].insertAdjacentHTML(
            'beforeEnd',
            `<tr><td>${e.name}</td><td>${e.level}</td></tr>`
          )
        );
      } else {
        element.children[1].tBodies[0].append('н/д');
      }
      break;
    case 'programmingSkills':
      if (value) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.className = 'tag';
          div.innerText = e;
          element.children[1].appendChild(div);
        });
      } else {
        var div = document.createElement('div');
        div.innerText = 'н/д';
        element.children[1].appendChild(div);
      }
      break;
    case 'languages':
      if (value) {
        value.forEach(e =>
          element.children[1].tBodies[0].insertAdjacentHTML(
            'beforeEnd',
            `<tr><td>${e.name}</td><td>${e.level}</td></tr>`
          )
        );
      } else {
        element.children[1].tBodies[0].append('н/д');
      }
      break;
    case 'commonSkills':
      if (value) {
        element.innerText = ': ' + value;
      } else {
        element.innerText = ': н/д';
      }
      break;
    case 'sapFunctionalExp':
      if (value && value.length) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.className = 'tag';
          div.innerText = `${e.abbreviation} : ${e.name}`;
          element.children[2].appendChild(div);
        });
      } else {
        var div = document.createElement('div');
        div.innerText = 'н/д';
        element.children[element.children.length - 1].appendChild(div);
      }
      break;
    case 'industries':
      if (value && value.length) {
        value.forEach((e, i, arr) => {
          var div = document.createElement('div');
          div.className = 'tag';
          div.innerText = e;
          element.appendChild(div);
        });
      } else {
        var div = document.createElement('div');
        div.innerText = 'н/д';
        element.children[element.children.length - 1].appendChild(div);
      }
      break;

    case 'managementExp':
    case 'projectPhases':
      if (value) {
        for (var i in value) {
          show(i);
          var el = document.querySelector(`[id=${i}]`);
          if (el) {
            if (value[i] == true || value[i] == 'true')
              el.children[1].innerText = 'Да';
            else if (value[i] == false || value[i] == 'false')
              el.children[1].innerText = 'Нет';
            else el.children[1].innerText = 'н/д';
          }
        }
      } else {
        element.innerHTML = '<h4>Опыт управления</h4><p>н/д</p>';
      }
      break;

    case 'period':
      if (value && value.expYear && value.expMonth) {
        element.innerText = `: ${value.expYear} г. и ${value.expMonth} м.`;
      } else {
        element.innerText = ': н/д';
      }
      break;
    case 'participationBDO':
    case 'participation':
      if (value && value.length) {
        value.forEach(e => {
          element.insertAdjacentHTML(
            'beforeEnd',
            `<table class="verticalForm" cellspacing="0">
                <tbody>
                  <tr>
                    <td>Клиент</td>
                    <td>${e.client}</td>
                  </tr>
                  <tr>
                    <td>Период</td>
                    <td>${e.start} - ${e.end}</td>
                  </tr>
                  <tr>
                    <td>Продолжительность (Лет и месяцев)</td>
                    <td>${e.durationYear} г. и ${e.durationMonth} м.</td>
                  </tr>
                  <tr>
                    <td>Индустрия</td>
                    <td>${e.industry}</td>
                  </tr>
                  <tr>
                    <td>Проект</td>
                    <td>${e.project}</td>
                  </tr>
                  <tr>
                    <td>Роль на проекте</td>
                    <td>${e.role}</td>
                  </tr>
                  <tr>
                    <td>Описание результата</td>
                    <td>${e.resultDescription}</td>
                  </tr>
                </tbody>
              </table>`
          );
        });
      }
    case 'thumbnailPhoto':
      if (value) {
        element.src = `${value}`;
      } else {
      }
      break;
    }
  }
});

function giveMe(path) {
  var elem = document.querySelector(`[id=${path[path.length - 1]}]`);
  elem.hidden = false;
  return elem;
}

function converter(data) {
  var oData = {};
  oData.name = data.name;
  oData.surname = data.surname;
  oData.patronymic = data.patronymic;

  oData.totalInfo = {};
  oData.totalInfo.position = data.position;
  oData.totalInfo.department = data.department;
  oData.totalInfo.birthday = data.birthday;
  oData.totalInfo.firstDay = data.firstDay;
  oData.totalInfo.academicDegree = data.academicDegree;

  oData.education = data.education;

  oData.experienceAndSkills = {};
  oData.experienceAndSkills.career = data.career;
  if (data.skills) {
    data.skills.consultingExp = data.skills.consultingExp
      ? data.skills.consultingExp
      : {};
    oData.experienceAndSkills.skills = data.skills;
    oData.experienceAndSkills.skills.commonSkills =
      data.skills.commonSkills && data.skills.commonSkills.map(e => e.skill);
    oData.experienceAndSkills.skills.programmingSkills =
      data.skills.programmingSkills &&
      data.skills.programmingSkills.map(e => e.language);
    oData.experienceAndSkills.skills.consultingExp =
      (data.skills.consultingExp.years || 0) +
      ' г., ' +
      (data.skills.consultingExp.months || 0) +
      ' м.';
  } else delete oData.experienceAndSkills.skills;
  oData.experienceAndSkills.sapIntroductionExp = {};
  if (data.sapIntroductionExp) {
    oData.experienceAndSkills.sapIntroductionExp.period = {
      expMonth: data.sapIntroductionExp.expMonth,
      expYear: data.sapIntroductionExp.expYear
    };
    oData.experienceAndSkills.industries = data.sapIntroductionExp.industries;
    oData.experienceAndSkills.sapIntroductionExp.participationBDO =
      data.participationBDO;
    oData.experienceAndSkills.sapIntroductionExp.participation =
      data.participation;
  }
  oData.experienceAndSkills.sapFunctionalExp = data.sapFunctionalExp;
  if (data.managementExp) {
    oData.experienceAndSkills.sapIntroductionExp.managementExp = {
      groupManagement: data.managementExp.groupManagement,
      projectManagement: data.managementExp.projectManagement
    };
    oData.experienceAndSkills.projectPhases = data.managementExp.projectPhases;
  }
  oData.thumbnailPhoto = data.thumbnailPhoto;
  return oData;
}

function show(id) {
  document.querySelector(`[id=${id}]`).hidden = false;
}

function showAllParents(aPath) {
  aPath.forEach(e => (document.querySelector(`[id=${e}]`).hidden = false));
}
