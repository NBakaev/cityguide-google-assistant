'use strict';

process.env.DEBUG = 'actions-on-google:*';
// Constants for list and carousel selection
const SELECTION_KEY_ONE = 'title';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';

var express = require('express');
var webApp = express();
var bodyParser = require('body-parser');
var request = require('request');

let defaultCities = [{ "id": "58591b8cb999bb13c831eea6", "name": "Nizhny Novgorod", "description": "Нижний Новгород — город с богатой историей, длиной почти в 800 лет. За это время здесь сформировалось немало исторических памятников, культурных достопримечательностей, объектов архитектуры, создающих его нынешний облик", "lastUpdate": 1496512284078, "rating": 0.0, "pois": 18, "content": { "imageUrl": "https://img-fotki.yandex.ru/get/15586/30348152.1ab/0_84264_58dbf19c_orig", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 70000.0, "location": {"latitude": 56.27, "longitude": 43.95} }, { "id": "585ad4bf90c869623b6a643a", "name": "Москва", "description": null, "lastUpdate": 1496495893323, "rating": 0.0, "pois": 4, "content": { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Panorama_of_Moscow_Kremlin.jpg/800px-Panorama_of_Moscow_Kremlin.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 40000.0, "location": {"latitude": 55.753536, "longitude": 37.61897} }, { "id": "585c1f4890c86924e9679ea7", "name": "Центр земли", "description": null, "lastUpdate": 1496495954711, "rating": 0.0, "pois": 1, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932a5233a714937540035a3", "name": "Рязань", "description": null, "lastUpdate": 1496495889834, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://mk-travel.ru/page_img/970.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932a52e3a714937540035a4", "name": "Санкт-Петербург", "description": null, "lastUpdate": 1496495939850, "rating": 0.0, "pois": 1, "content": { "imageUrl": "https://travel.rambler.ru/media/original_images/5356a3b88b547.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b77a3a714937540035a5", "name": "Ростов-на-Дону", "description": null, "lastUpdate": 1496496054587, "rating": 0.0, "pois": 1, "content": { "imageUrl": "https://static.tonkosti.ru/images/7/76/%D0%A6%D0%B5%D1%80%D0%BA%D0%BE%D0%B2%D1%8C_%D0%B2_%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%B5-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b7c13a714937540035a6", "name": "Самара", "description": null, "lastUpdate": 1496496115029, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://gooper.ru/uploads/posts/2014-03/1394178008_post-11198-1256232640.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b7fd3a714937540035a7", "name": "Новосибирск", "description": null, "lastUpdate": 1496496155695, "rating": 0.0, "pois": 1, "content": { "imageUrl": "https://img-fotki.yandex.ru/get/15480/30348152.1b3/0_86856_77358ac5_orig", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b8563a714937540035a8", "name": "Красноярск", "description": null, "lastUpdate": 1496496256616, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://img.travel.ru/images2/2014/11/object238422/001_62371_original.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b8863a714937540035a9", "name": "Хабаровск", "description": null, "lastUpdate": 1496496304106, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://organum-visus.com/sites/default/files/styles/1024x768/public/news_mini_top_img/khabarovsk-organum-visus-eyenews-120712g.jpeg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b8bd3a714937540035aa", "name": "Мурманск", "description": null, "lastUpdate": 1496496348067, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://strana.ru/media/images/original/original24561273.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }, { "id": "5932b8fc3a714937540035ab", "name": "Пенза", "description": null, "lastUpdate": 1496496407423, "rating": 0.0, "pois": 1, "content": { "imageUrl": "http://russia.rin.ru/pictures/4789.jpg", "imageUrls": [], "videoUrl": null, "audioUrl": null}, "approximateRadius": 100.0, "location": {"latitude": 0.0, "longitude": 0.0} }];
let defaultPois = [{ "name": "Центр земли", "description": "<p>544ttret</p>", "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 0.0, "longitude": 0.0}, "id": "58302f09f5406e03aa134b92", "cityId": "5932b8fc3a714937540035ab", "lastUpdate": 1496496915209, "rating": 5.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Нижний центр", "description": "<p style=\"font-size: 14px;\"><strong>Ни́жний Но́вгород</strong>&nbsp;(в разговорной речи часто&nbsp;&mdash; <em>Нижний</em>, с 1932 по 1990 год&nbsp;&mdash; <strong>Го́рький</strong>)&nbsp;&mdash; <a title=\"Город\" href=\"https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4\">город</a> в центральной <a title=\"Россия\" href=\"https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F\">России</a>, <a title=\"Административный центр\" href=\"https://ru.wikipedia.org/wiki/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9_%D1%86%D0%B5%D0%BD%D1%82%D1%80\">административный центр</a><a title=\"Приволжский федеральный округ\" href=\"https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%B2%D0%BE%D0%BB%D0%B6%D1%81%D0%BA%D0%B8%D0%B9_%D1%84%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BE%D0%BA%D1%80%D1%83%D0%B3\">Приволжского федерального округа</a> и <a title=\"Нижегородская область\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%B5%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C\">Нижегородской области</a>. Основан в 1221 году владимирским князем <a title=\"Юрий Всеволодович\" href=\"https://ru.wikipedia.org/wiki/%D0%AE%D1%80%D0%B8%D0%B9_%D0%92%D1%81%D0%B5%D0%B2%D0%BE%D0%BB%D0%BE%D0%B4%D0%BE%D0%B2%D0%B8%D1%87\">Юрием Всеволодовичем</a>.</p>\n<p style=\"font-size: 14px;\">Расположен в центре <a title=\"Восточно-Европейская равнина\" href=\"https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%BE-%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D0%B5%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D1%80%D0%B0%D0%B2%D0%BD%D0%B8%D0%BD%D0%B0\">Восточно-Европейской равнины</a> на месте <a title=\"Стрелка (Нижний Новгород)\" href=\"https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0_(%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4)\">слияния</a> <a title=\"Ока\" href=\"https://ru.wikipedia.org/wiki/%D0%9E%D0%BA%D0%B0\">Оки</a> и <a class=\"mw-redirect\" title=\"Волга (река)\" href=\"https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D0%BB%D0%B3%D0%B0_(%D1%80%D0%B5%D0%BA%D0%B0)\">Волги</a>. Ока делит город на две части: <a title=\"Нагорная часть Нижнего Новгорода\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B3%D0%BE%D1%80%D0%BD%D0%B0%D1%8F_%D1%87%D0%B0%D1%81%D1%82%D1%8C_%D0%9D%D0%B8%D0%B6%D0%BD%D0%B5%D0%B3%D0%BE_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0\">нагорную</a>&nbsp;&mdash; верхнюю, на <a title=\"Дятловы горы\" href=\"https://ru.wikipedia.org/wiki/%D0%94%D1%8F%D1%82%D0%BB%D0%BE%D0%B2%D1%8B_%D0%B3%D0%BE%D1%80%D1%8B\">Дятловых горах</a>, и <a title=\"Заречная часть Нижнего Новгорода\" href=\"https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D1%80%D0%B5%D1%87%D0%BD%D0%B0%D1%8F_%D1%87%D0%B0%D1%81%D1%82%D1%8C_%D0%9D%D0%B8%D0%B6%D0%BD%D0%B5%D0%B3%D0%BE_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0\">заречную</a>&nbsp;&mdash; нижнюю, на её левом низинном берегу. Волга разделяет Нижний Новгород и <a title=\"Городской округ город Бор\" href=\"https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%BE%D0%B9_%D0%BE%D0%BA%D1%80%D1%83%D0%B3_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4_%D0%91%D0%BE%D1%80\">Борский округ</a>.</p>\n<p style=\"font-size: 14px;\">В 1500&mdash;1518 годах был построен каменный <a title=\"Нижегородский кремль\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%B5%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9_%D0%BA%D1%80%D0%B5%D0%BC%D0%BB%D1%8C\">кремль</a>, который не был взят ни разу за всю историю. <a title=\"Площадь Народного единства\" href=\"https://ru.wikipedia.org/wiki/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9D%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B0\">Под</a> его стенами, в 1611 году, <a class=\"mw-redirect\" title=\"Земский староста\" href=\"https://ru.wikipedia.org/wiki/%D0%97%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9_%D1%81%D1%82%D0%B0%D1%80%D0%BE%D1%81%D1%82%D0%B0\">земский староста</a> <a title=\"Кузьма Минин\" href=\"https://ru.wikipedia.org/wiki/%D0%9A%D1%83%D0%B7%D1%8C%D0%BC%D0%B0_%D0%9C%D0%B8%D0%BD%D0%B8%D0%BD\">Кузьма Минин</a> собрал средства и вместе с князем <a class=\"mw-redirect\" title=\"Дмитрий Пожарский\" href=\"https://ru.wikipedia.org/wiki/%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%9F%D0%BE%D0%B6%D0%B0%D1%80%D1%81%D0%BA%D0%B8%D0%B9\">Пожарским</a> организовал <a title=\"Второе народное ополчение\" href=\"https://ru.wikipedia.org/wiki/%D0%92%D1%82%D0%BE%D1%80%D0%BE%D0%B5_%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%D0%B5_%D0%BE%D0%BF%D0%BE%D0%BB%D1%87%D0%B5%D0%BD%D0%B8%D0%B5\">народное ополчение</a> для освобождения <a title=\"Москва\" href=\"https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0\">Москвы</a> от <a title=\"Польско-литовская оккупация Москвы\" href=\"https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%BE-%D0%BB%D0%B8%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%BE%D0%BA%D0%BA%D1%83%D0%BF%D0%B0%D1%86%D0%B8%D1%8F_%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D1%8B\">поляков</a>. С 1817 года, с переводом в город <a title=\"Нижегородская ярмарка\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%B5%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F_%D1%8F%D1%80%D0%BC%D0%B0%D1%80%D0%BA%D0%B0\">Макарьевской ярмарки</a>, располагавшейся ранее близ <a title=\"Желтоводский Макариев монастырь\" href=\"https://ru.wikipedia.org/wiki/%D0%96%D0%B5%D0%BB%D1%82%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9_%D0%9C%D0%B0%D0%BA%D0%B0%D1%80%D0%B8%D0%B5%D0%B2_%D0%BC%D0%BE%D0%BD%D0%B0%D1%81%D1%82%D1%8B%D1%80%D1%8C\">Желтоводского Макариева монастыря</a>, он становится одним из крупнейших торговых центров <a title=\"Российская империя\" href=\"https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F\">России</a>. В 1896 году в городе прошла <a title=\"Всероссийская выставка в Нижнем Новгороде (1896)\" href=\"https://ru.wikipedia.org/wiki/%D0%92%D1%81%D0%B5%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%B2%D1%8B%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0_%D0%B2_%D0%9D%D0%B8%D0%B6%D0%BD%D0%B5%D0%BC_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B5_(1896)\">Всероссийская художественно-промышленная выставка</a>, давшая развитие <a title=\"Нижегородский трамвай\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%B5%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9_%D1%82%D1%80%D0%B0%D0%BC%D0%B2%D0%B0%D0%B9\">российскому трамваю</a>. Во время <a title=\"Индустриализация СССР\" href=\"https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%A1%D0%A1%D0%A1%D0%A0\">индустриализации</a> 1930-х годов в нём были построены крупные машиностроительные предприятия, в том числе крупнейший автогигант&nbsp;&mdash; <a title=\"Горьковский автомобильный завод\" href=\"https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D1%8C%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4\">Горьковский автомобильный завод</a><sup id=\"cite_ref-10\" class=\"reference\" style=\"font-size: 11.2px;\"><a href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4#cite_note-10\">[10]</a></sup>. Во время <a title=\"Великая Отечественная война\" href=\"https://ru.wikipedia.org/wiki/%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B0%D1%8F_%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B2%D0%BE%D0%B9%D0%BD%D0%B0\">Великой Отечественной войны</a> 1941&mdash;1945 годов город был крупнейшим поставщиком военной техники<sup id=\"cite_ref-11\" class=\"reference\" style=\"font-size: 11.2px;\"><a href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4#cite_note-11\">[11]</a></sup>, в силу чего подвергался <a title=\"Бомбардировка Горького\" href=\"https://ru.wikipedia.org/wiki/%D0%91%D0%BE%D0%BC%D0%B1%D0%B0%D1%80%D0%B4%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0_%D0%93%D0%BE%D1%80%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE\">бомбардировкам</a>. После войны город был награждён <a title=\"Орден Ленина\" href=\"https://ru.wikipedia.org/wiki/%D0%9E%D1%80%D0%B4%D0%B5%D0%BD_%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0\">орденом Ленина</a>. 20 ноября 1985 года в городе был запущен первый участок <a title=\"Нижегородский метрополитен\" href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%B5%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9_%D0%BC%D0%B5%D1%82%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B5%D0%BD\">метрополитена</a>. Хронологически это третий метрополитен в России и десятый в <a class=\"mw-redirect\" title=\"СССР\" href=\"https://ru.wikipedia.org/wiki/%D0%A1%D0%A1%D0%A1%D0%A0\">СССР</a>. В 2016 году <a title=\"Путин, Владимир Владимирович\" href=\"https://ru.wikipedia.org/wiki/%D0%9F%D1%83%D1%82%D0%B8%D0%BD,_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B8%D1%87\">Владимир Путин</a> открыл новый Нижегородский завод имени 70-летия Победы концерна &laquo;<a title=\"Алмаз-Антей\" href=\"https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%BC%D0%B0%D0%B7-%D0%90%D0%BD%D1%82%D0%B5%D0%B9\">Алмаз-Антей</a>&raquo;, занимающийся выпуском военной техники<sup id=\"cite_ref-.D0.97.D0.B0.D0.B2.D0.BE.D0.B4_12-0\" class=\"reference\" style=\"font-size: 11.2px;\"><a href=\"https://ru.wikipedia.org/wiki/%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9_%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4#cite_note-.D0.97.D0.B0.D0.B2.D0.BE.D0.B4-12\">[12]</a></sup>.</p>\n<!--EndFragment-->\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>", "content": { "imageUrl": "http://loveopium.ru/content/2015/09/nn/00.jpg", "imageUrls": [], "videoUrl": "https://www.youtube.com/watch?v=i8Nl46_Wve8", "audioUrl": null}, "location": {"latitude": 56.32867, "longitude": 44.00205}, "id": "5800c2bec974c5223458e20f", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909139, "rating": 4.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Сенатский дворец", "description": "<p><strong>Сена́тский дворе́ц</strong> &mdash; здание на территории Московского Кремля, построенное по проекту русского архитектора Матвея Казакова в 1776&mdash;1787 годах. Дворец выполнен по заказу императрицы Екатерины Великой в характерном для того времени классическом стиле. По первоначальному замыслу здание должно было служить резиденцией высшего органа государственной власти Российской империи &mdash; Правительствующего сената, откуда и получило своё название. За время своего существования его стены увидели немало государственных деятелей и вмещали различные органы государственной власти. В XIX веке дворец нарекли &laquo;зданием присутственных мест&raquo; (так в ту пору назывались здания, вмещавшие органы административного управления и местные суды), при Советской власти во дворце находился кабинет В. И. Ленина, позднее он становится зданием Правительства СССР. В настоящее время Сенатский дворец является рабочей резиденцией президента Российской Федерации.</p>", "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 55.7535, "longitude": 37.6}, "id": "585ad59a90c869623b6a643c", "cityId": "585ad4bf90c869623b6a643a", "lastUpdate": 1496496910420, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Театр имени Пушкина", "description": "Что-то у москвы", "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 55.7635, "longitude": 37.6}, "id": "585ae2f790c869623b6a6440", "cityId": "585ad4bf90c869623b6a643a", "lastUpdate": 1496496910536, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Государственный музей изобразительных искусств имени А.С. Пушкина", "description": "Госуда́рственный музе́й изобрази́тельных иску́сств и́мени А. С. Пу́шкина (сокращённо ГМИИ им. А. С. Пушкина) — один из самых крупных и значительных в России и в мире музеев европейского и мирового искусства. Памятник архитектуры, расположен в центре Москвы по адресу: улица Волхонка, 12. Открыт 31 мая (13 июня) 1912 года.", "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 55.745444, "longitude": 37.6033674}, "id": "585af4f090c869623b6a6447", "cityId": "585ad4bf90c869623b6a643a", "lastUpdate": 1496496910304, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Государственная Третьяковская галерея", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 55.7473848, "longitude": 37.6039112}, "id": "585af5cd90c869623b6a6449", "cityId": "585ad4bf90c869623b6a643a", "lastUpdate": 1496496910189, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Мемориальная стена", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3267429, "longitude": 44.0038726}, "id": "58e37f08ca3cc035a0a42077", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909256, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Городская больница № 3", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3193053, "longitude": 44.0242053}, "id": "58e3831bca3cc035a0a42079", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909488, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "AZIMUT Отель Нижний Новгород", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3234406, "longitude": 43.980943}, "id": "58e38c55ca3cc035a0a4208c", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908211, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Парус", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3225335, "longitude": 43.9897392}, "id": "58e38c55ca3cc035a0a4208b", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908559, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Памятник Н. А. Добролюбову", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3242832, "longitude": 44.0021298}, "id": "58e38c55ca3cc035a0a4208d", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908906, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Николь", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3211781, "longitude": 43.92996669999999}, "id": "58e38c55ca3cc035a0a42091", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908091, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Воробей", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3106012, "longitude": 43.9907517}, "id": "58e38c55ca3cc035a0a42093", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908327, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Бизнес-отель \"Дипломат\"", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.324994, "longitude": 44.023612}, "id": "58e38c55ca3cc035a0a42092", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909605, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Сергиевская", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.323218, "longitude": 43.9901382}, "id": "58e38c56ca3cc035a0a42094", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908675, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Ibis", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3149198, "longitude": 44.0017811}, "id": "58e38c55ca3cc035a0a42090", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908791, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Отель \"SHATO CITY\"", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.30826279999999, "longitude": 43.9752909}, "id": "58e38c55ca3cc035a0a4208f", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496907859, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Отель \"Горький\" ***", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.32541699999999, "longitude": 44.003646}, "id": "58e38c55ca3cc035a0a4208e", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909022, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Нижний Новгород", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.2965039, "longitude": 43.9360589}, "id": "58e38c56ca3cc035a0a42095", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496907743, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Маринс Парк Отель", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.32554419999999, "longitude": 43.9581914}, "id": "58e38c56ca3cc035a0a42096", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496907975, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Октябрьская", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.328548, "longitude": 44.01961499999999}, "id": "58e38c56ca3cc035a0a42097", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909372, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Кофехостел", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.3274801, "longitude": 43.98426459999999}, "id": "58e38c56ca3cc035a0a42098", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496908443, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }, { "name": "Гостиница \"Автозаводская\"", "description": null, "content": {"imageUrl": null, "imageUrls": [], "videoUrl": null, "audioUrl": null}, "location": {"latitude": 56.2424185, "longitude": 43.86157339999999}, "id": "58e38c56ca3cc035a0a42099", "cityId": "58591b8cb999bb13c831eea6", "lastUpdate": 1496496909720, "rating": 0.0, "externalResourceLink": {"googlePlaceId": null} }];

webApp.use(bodyParser.json());
webApp.use('/', function (req, res) {
    try {
        handleApi(req, res)
    } catch (e) {
        console.log(e);
    }
});

var baseServerUrl = 'https://cityguide.nbakaev.com/api/v1/';

webApp.listen(12222, function () {
    console.log('Example app listening on port 3000!');
});

process.env.DEBUG = 'actions-on-google:*';
let ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

let handleApi = (req, res) => {
    if (req.method === "GET") {
        res.sendStatus(200);
        return;
    }

    const app = new ActionsSdkApp({request: req, response: res});

    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));

    function handleShowCity(app) {
        // request.get(baseServerUrl + 'city', function (err, res, body) {
        //     if (err) {
        //     }


        // JSON.parse(data)

        //     data.forEach(x => {
        //     // Add the first item to the carousel
        //     app.askWithCarousel(app.buildRichResponse()
        //             .addSimpleResponse('This is a simple response for a carousel')
        //             .addSuggestions(
        //                 ['Basic Card', 'List', 'Carousel', 'Suggestions']).
        //         buildCarousel())
        //         .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
        //         [x.name])
        //         .setTitle(x.name)
        //         .setDescription(x.description)
        //         .setImage(x.content.imageUrl, 'Image alternate text'))
        // });

        carousel(app);

        // });
    }

    // Welcome
    function welcome(app) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse({speech: 'Hi there!', displayText: 'Hello there!'})
            .addSimpleResponse({
                speech: 'I can show you basic cards, lists and carousels as well as suggestions',
                displayText: 'I can show you basic cards, lists and carousels as well as suggestions'
            })
            .addSuggestions(
                ['Basic Card', 'List', 'Carousel', 'Suggestions']));
    }

    function normalAsk(app) {
        app.ask('Ask me to show you a list, carousel, or basic card');
    }

    // Suggestions
    function suggestions(app) {
        app.ask(app
            .buildRichResponse()
            .addSimpleResponse('This is a simple response for suggestions')
            .addSuggestions('Suggestion Chips')
            .addSuggestions(['Basic Card', 'List', 'Carousel'])
            .addSuggestionLink('Suggestion Link', 'https://assistant.google.com/'));
    }

    // Suggestions
    function handleNearby(app) {
        if (app.getDeviceLocation() == null) {
            app.askForPermission("To show nearest POIs", app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
            return;
        }

        let pois = defaultPois.sort((a, b) => {
            let latitude = app.getDeviceLocation().coordinates.latitude;
            let longitude = app.getDeviceLocation().coordinates.longitude;

            if (getDistanceFromLatLonInKm(a.location.latitude, a.location.longitude, latitude,longitude) >
                getDistanceFromLatLonInKm(b.location.latitude, b.location.longitude, latitude,longitude)){
                return 1;
            }else{
                return -1;
            }

        }).slice(0,5);

        let suggest = pois.map(x => x.name);

        app.ask(app
            .buildRichResponse()
            .addSimpleResponse('Pois nearby')
            // .addSuggestions(app.getDeviceLocation().coordinates.latitude + " | " + app.getDeviceLocation().coordinates.longitude)
            .addSuggestions(suggest));
    }

    // Basic card
    function basicCard(app) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse('This is the first simple response for a basic card')
            .addSuggestions(
                ['Basic Card', 'List', 'Carousel', 'Suggestions'])
            // Create a basic card and add it to the rich response
            .addBasicCard(app.buildBasicCard(`This is a basic card.  Text in a
        basic card can include "quotes" and most other unicode characters 
        including emoji 📱.  Basic cards also support some markdown 
        formatting like *emphasis* or _italics_, **strong** or __bold__, 
        and ***bold itallic*** or ___strong emphasis___ as well as other things
        like line  \nbreaks`) // Note the two spaces before '\n' required for a
                // line break to be rendered in the card
                    .setSubtitle('This is a subtitle')
                    .setTitle('Title: this is a title')
                    .addButton('This is a button', 'https://assistant.google.com/')
                    .setImage('', 'Image alternate text')
            )
            .addSimpleResponse({
                speech: 'This is the second simple response ',
                displayText: 'This is the 2nd simple response'
            })
        );
    }

    // List
    function list(app) {
        app.askWithList(app.buildRichResponse()
                .addSimpleResponse('This is a simple response for a list')
                .addSuggestions(
                    ['Basic Card', 'List', 'Carousel', 'Suggestions']),
            // Build a list
            app.buildList('List Title')
            // Add the first item to the list
                .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
                    ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
                    .setTitle('Title of First List Item')
                    .setDescription('This is a description of a list item')
                    .setImage(IMG_URL_AOG, 'Image alternate text'))
                // Add the second item to the list
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
                    ['Google Home Assistant', 'Assistant on the Google Home'])
                    .setTitle('Google Home')
                    .setDescription(`Google Home is a voice-activated speaker powered by
            the Google Assistant.`)
                    .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
                )
                // Add third item to the list
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
                    ['Google Pixel XL', 'Pixel', 'Pixel XL'])
                    .setTitle('Google Pixel')
                    .setDescription('Pixel. Phone by Google.')
                    .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
                )
                // Add last item of the list
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
                    .setTitle('Google Allo')
                    .setDescription('Introducing Google Allo, a smart messaging app' +
                        'that helps you say more and do more.')
                    .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
                    .addSynonyms('Allo')
                )
        );
    }

    // Carousel
    function carousel(app) {
        app.askWithCarousel(app.buildRichResponse()
                .addSimpleResponse('This is a simple response for a carousel')
                .addSuggestions(
                    ['Basic Card', 'List', 'Carousel', 'Suggestions']),
            app.buildCarousel()
            // Add the first item to the carousel
                .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
                    ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
                    .setTitle('Title of First List Item')
                    .setDescription('This is a description of a carousel item')
                    .setImage('https://cityguide.nbakaev.com/assets/img/ic_launcher.png', 'Image alternate text'))
                // Add the second item to the carousel
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
                    ['Google Home Assistant', 'Assistant on the Google Home'])
                    .setTitle('Google Home')
                    .setDescription(`Google Home is a voice-activated speaker powered by
            the Google Assistant.`)
                    .setImage('https://cityguide.nbakaev.com/assets/img/ic_launcher.png', 'Google Home')
                )
                // Add third item to the carousel
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
                    ['Google Pixel XL', 'Pixel', 'Pixel XL'])
                    .setTitle('Google Pixel')
                    .setDescription('Pixel. Phone by Google.')
                    .setImage('https://cityguide.nbakaev.com/assets/img/ic_launcher.png', 'Google Pixel')
                )
                // Add last item of the carousel
                .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
                    .setTitle('Google Allo')
                    .setDescription('Introducing Google Allo, a smart messaging app' +
                        'that helps you say more and do more.')
                    .setImage('https://cityguide.nbakaev.com/assets/img/ic_launcher.png', 'Google Allo Logo')
                    .addSynonyms('Allo')
                )
        );
    }

    // React to list or carousel selection
    function itemSelected(app) {
        const param = app.getSelectedOption();
        console.log('USER SELECTED: ' + param);
        if (!param) {
            app.ask('You did not select any item from the list or carousel');
        } else if (param === SELECTION_KEY_ONE) {
            app.ask('You selected the first item in the list or carousel');
        } else if (param === SELECTION_KEY_GOOGLE_HOME) {
            app.ask('You selected the Google Home!');
        } else if (param === SELECTION_KEY_GOOGLE_PIXEL) {
            app.ask('You selected the Google Pixel!');
        } else if (param === SELECTION_KEY_GOOGLE_ALLO) {
            app.ask('You selected Google Allo!');
        } else {
            app.ask('You selected an unknown item from the list or carousel');
        }
    }

    // Leave conversation with card
    function byeCard(app) {
        app.tell(app.buildRichResponse()
            .addSimpleResponse('Goodbye, World!')
            .addBasicCard(app.buildBasicCard('This is a goodbye card.')));
    }

    // Leave conversation with SimpleResponse
    function byeResponse(app) {
        app.tell({
            speech: 'Okay see you later',
            displayText: 'OK see you later!'
        });
    }

    function showCityDetails(app) {
        let city = {
            "id": "58591b8cb999bb13c831eea6",
            "name": "Nizhny Novgorod",
            "description": "Нижний Новгород — город с богатой историей, длиной почти в 800 лет. За это время здесь сформировалось немало исторических памятников, культурных достопримечательностей, объектов архитектуры, создающих его нынешний облик",
            "lastUpdate": 1496512284078,
            "rating": 0.0,
            "pois": 18,
            "content": {
                "imageUrl": "https://img-fotki.yandex.ru/get/15586/30348152.1ab/0_84264_58dbf19c_orig",
                "imageUrls": [],
                "videoUrl": null,
                "audioUrl": null
            },
            "approximateRadius": 70000.0,
            "location": {"latitude": 56.27, "longitude": 43.95}
        };

        app.ask(app.buildRichResponse()
            .addBasicCard(app.buildBasicCard(city.description)
                // line break to be rendered in the card
                    .setSubtitle('Город')
                    .setTitle(city.name)
                    .addButton('Open in App', `https://cityguide.nbakaev.com/poi/details/${city.id}`)
                    .setImage(city.content.imageUrl, city.name)
            )
            .addSimpleResponse({
                speech: 'Here is description about ' + city.name,
                displayText: 'Here is description about ' + city.name
            })
        );
    }


    // Leave conversation
    function normalBye(app) {
        app.tell('Okay see you later!');
    }

    function actionsText(app) {
        let rawInput = app.getRawInput();

        let previousAskedLocation = false;
        if (req.body.inputs && req.body.inputs[0] && req.body.inputs[0].intent === 'assistant.intent.action.PERMISSION') {
            // heck if arguments[0].name === 'permission_granted'
            previousAskedLocation = true;
            if (previousAskedLocation) {
                rawInput = 'Nearby';
            }
        }

        console.log('USER SAID ' + rawInput);
        if (rawInput === 'Basic Card' || rawInput === 'basic card') {
            basicCard(app);
        } else if (rawInput === 'List' || rawInput === 'list') {
            list(app);
        } else if (rawInput === 'City' || rawInput === 'city') {
            handleShowCity(app);
        } else if (rawInput === 'nearby' || rawInput === 'Nearby') {
            handleNearby(app);
        } else if (rawInput === 'Carousel' || rawInput === 'carousel') {
            carousel(app);
        } else if (rawInput === 'normal ask') {
            normalAsk(app);
        } else if (rawInput === 'normal bye') {
            normalBye(app);
        } else if (rawInput === 'bye card') {
            byeCard(app);
        } else if (rawInput === 'bye response') {
            byeResponse(app);
        } else if (rawInput === 'Nizhny Novgorod') {
            showCityDetails(app);
            //    TODO: right impl
        } else if (rawInput === 'Suggestions' || rawInput === 'Suggestion Chips' ||
            rawInput === 'suggestions' || rawInput === 'suggestions chips') {
            suggestions(app);
        } else {
            normalAsk(app);
        }
    }

    const actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, welcome);
    actionMap.set(app.StandardIntents.TEXT, actionsText);
    actionMap.set(app.StandardIntents.PERMISSION, actionsText);
    actionMap.set(app.StandardIntents.OPTION, itemSelected);
    app.handleRequest(actionMap);
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}