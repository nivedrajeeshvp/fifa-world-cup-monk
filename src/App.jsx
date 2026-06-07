import { useState, useEffect, useMemo } from 'react';
import './App.css';
import monkLogo from './world-cup-monk-logo.png';
import stadiumFallback from './stadium-fallback.svg';

const WORLD_CUP_START = new Date('2026-06-11T15:00:00-04:00');
const FAVORITES_KEY = 'wchq-favorites';

const TEAMS = {
  alg: { name: 'Algeria',               code: 'ALG', flag: '', group: 'J', ranking: 28, participations: 4 },
  arg: { name: 'Argentina',             code: 'ARG', flag: '', group: 'J', ranking: 3,  participations: 18 },
  aus: { name: 'Australia',             code: 'AUS', flag: '', group: 'D', ranking: 27, participations: 6 },
  aut: { name: 'Austria',               code: 'AUT', flag: '', group: 'J', ranking: 24, participations: 7 },
  bel: { name: 'Belgium',               code: 'BEL', flag: '', group: 'G', ranking: 9,  participations: 13 },
  bih: { name: 'Bosnia & Herzegovina',  code: 'BIH', flag: '', group: 'B', ranking: 65, participations: 1 },
  bra: { name: 'Brazil',                code: 'BRA', flag: '', group: 'C', ranking: 6,  participations: 22 },
  cpv: { name: 'Cabo Verde',            code: 'CPV', flag: '', group: 'H', ranking: 69, participations: 0 },
  can: { name: 'Canada',                code: 'CAN', flag: '', group: 'B', ranking: 30, participations: 2,  host: true },
  col: { name: 'Colombia',              code: 'COL', flag: '', group: 'K', ranking: 13, participations: 6 },
  cod: { name: 'Congo DR',              code: 'COD', flag: '', group: 'K', ranking: 46, participations: 1 },
  civ: { name: "Cote d'Ivoire",         code: 'CIV', flag: '', group: 'E', ranking: 34, participations: 3 },
  cro: { name: 'Croatia',               code: 'CRO', flag: '', group: 'L', ranking: 11, participations: 6 },
  cur: { name: 'Curacao',               code: 'CUR', flag: '', group: 'E', ranking: 82, participations: 0 },
  cze: { name: 'Czechia',               code: 'CZE', flag: '', group: 'A', ranking: 41, participations: 9 },
  ecu: { name: 'Ecuador',               code: 'ECU', flag: '', group: 'E', ranking: 23, participations: 4 },
  egy: { name: 'Egypt',                 code: 'EGY', flag: '', group: 'G', ranking: 29, participations: 3 },
  eng: { name: 'England',               code: 'ENG', flag: '', group: 'L', ranking: 4,  participations: 16 },
  fra: { name: 'France',                code: 'FRA', flag: '', group: 'I', ranking: 1,  participations: 16 },
  ger: { name: 'Germany',               code: 'GER', flag: '', group: 'E', ranking: 10, participations: 20 },
  gha: { name: 'Ghana',                 code: 'GHA', flag: '', group: 'L', ranking: 74, participations: 4 },
  hti: { name: 'Haiti',                 code: 'HTI', flag: '', group: 'C', ranking: 83, participations: 1 },
  irn: { name: 'Iran',                  code: 'IRN', flag: '', group: 'G', ranking: 21, participations: 6 },
  irq: { name: 'Iraq',                  code: 'IRQ', flag: '', group: 'I', ranking: 57, participations: 1 },
  jpn: { name: 'Japan',                 code: 'JPN', flag: '', group: 'F', ranking: 18, participations: 7 },
  jor: { name: 'Jordan',                code: 'JOR', flag: '', group: 'J', ranking: 63, participations: 0 },
  kor: { name: 'Korea Republic',        code: 'KOR', flag: '', group: 'A', ranking: 25, participations: 10 },
  mar: { name: 'Morocco',               code: 'MAR', flag: '', group: 'C', ranking: 8,  participations: 6 },
  mex: { name: 'Mexico',                code: 'MEX', flag: '', group: 'A', ranking: 15, participations: 17, host: true },
  nzl: { name: 'New Zealand',           code: 'NZL', flag: '', group: 'G', ranking: 85, participations: 2 },
  ned: { name: 'Netherlands',           code: 'NED', flag: '', group: 'F', ranking: 7,  participations: 10 },
  nor: { name: 'Norway',                code: 'NOR', flag: '', group: 'I', ranking: 31, participations: 3 },
  pan: { name: 'Panama',                code: 'PAN', flag: '', group: 'L', ranking: 33, participations: 1 },
  pry: { name: 'Paraguay',              code: 'PRY', flag: '', group: 'D', ranking: 40, participations: 8 },
  por: { name: 'Portugal',              code: 'POR', flag: '', group: 'K', ranking: 5,  participations: 9 },
  qat: { name: 'Qatar',                 code: 'QAT', flag: '', group: 'B', ranking: 55, participations: 1 },
  ksa: { name: 'Saudi Arabia',          code: 'KSA', flag: '', group: 'H', ranking: 61, participations: 6 },
  sco: { name: 'Scotland',              code: 'SCO', flag: '', group: 'C', ranking: 43, participations: 7 },
  sen: { name: 'Senegal',               code: 'SEN', flag: '', group: 'I', ranking: 14, participations: 3 },
  zaf: { name: 'South Africa',          code: 'ZAF', flag: '', group: 'A', ranking: 60, participations: 3 },
  esp: { name: 'Spain',                 code: 'ESP', flag: '', group: 'H', ranking: 2,  participations: 16 },
  swe: { name: 'Sweden',                code: 'SWE', flag: '', group: 'F', ranking: 38, participations: 12 },
  sui: { name: 'Switzerland',           code: 'SUI', flag: '', group: 'B', ranking: 19, participations: 12 },
  tun: { name: 'Tunisia',               code: 'TUN', flag: '', group: 'F', ranking: 44, participations: 6 },
  tur: { name: 'Turkiye',               code: 'TUR', flag: '', group: 'D', ranking: 22, participations: 2 },
  uru: { name: 'Uruguay',               code: 'URU', flag: '', group: 'H', ranking: 17, participations: 14 },
  usa: { name: 'USA',                   code: 'USA', flag: '', group: 'D', ranking: 16, participations: 11, host: true },
  uzb: { name: 'Uzbekistan',            code: 'UZB', flag: '', group: 'K', ranking: 50, participations: 0 },
};

// All times stored as local kickoff times with UTC offset.
// The app converts to IST (UTC+5:30) automatically via Intl/toLocaleDateString.
// EDT = UTC-4  |  CDT = UTC-5  |  MDT = UTC-6  |  PDT = UTC-7
// Toronto/Vancouver are also EDT/PDT respectively.
// IST reference: 3 PM EDT = 12:30 AM IST next day; 9 PM EDT = 6:30 AM IST next day

const MATCHES = [
  // ─────────────── GROUP A  (Mexico · Korea Republic · Czechia · South Africa) ───────────────
  { id: 'gA1', datetime: '2026-06-11T14:00:00-05:00', home: 'mex', away: 'zaf', venue: 'Estadio Azteca, Mexico City',               stage: 'Group A', status: 'upcoming' },
  { id: 'gA2', datetime: '2026-06-11T21:00:00-05:00', home: 'kor', away: 'cze', venue: 'Estadio Akron, Guadalajara',                stage: 'Group A', status: 'upcoming' },
  { id: 'gA3', datetime: '2026-06-18T20:00:00-05:00', home: 'mex', away: 'kor', venue: 'Estadio Akron, Guadalajara',                stage: 'Group A', status: 'upcoming' },
  { id: 'gA4', datetime: '2026-06-18T12:00:00-04:00', home: 'cze', away: 'zaf', venue: 'Mercedes-Benz Stadium, Atlanta',            stage: 'Group A', status: 'upcoming' },
  { id: 'gA5', datetime: '2026-06-24T20:00:00-05:00', home: 'cze', away: 'mex', venue: 'Estadio Azteca, Mexico City',               stage: 'Group A', status: 'upcoming' },
  { id: 'gA6', datetime: '2026-06-24T19:00:00-06:00', home: 'zaf', away: 'kor', venue: 'Estadio BBVA, Monterrey',                   stage: 'Group A', status: 'upcoming' },

  // ─────────────── GROUP B  (Canada · Bosnia & Herzegovina · Qatar · Switzerland) ───────────────
  { id: 'gB1', datetime: '2026-06-12T15:00:00-04:00', home: 'can', away: 'bih', venue: 'BMO Field, Toronto',                        stage: 'Group B', status: 'upcoming' },
  { id: 'gB2', datetime: '2026-06-13T12:00:00-07:00', home: 'qat', away: 'sui', venue: "Levi's Stadium, San Francisco",             stage: 'Group B', status: 'upcoming' },
  { id: 'gB3', datetime: '2026-06-18T15:00:00-07:00', home: 'can', away: 'qat', venue: 'BC Place, Vancouver',                       stage: 'Group B', status: 'upcoming' },
  { id: 'gB4', datetime: '2026-06-18T12:00:00-07:00', home: 'sui', away: 'bih', venue: 'SoFi Stadium, Los Angeles',                 stage: 'Group B', status: 'upcoming' },
  { id: 'gB5', datetime: '2026-06-24T12:00:00-07:00', home: 'sui', away: 'can', venue: 'BC Place, Vancouver',                       stage: 'Group B', status: 'upcoming' },
  { id: 'gB6', datetime: '2026-06-24T12:00:00-07:00', home: 'bih', away: 'qat', venue: 'Lumen Field, Seattle',                      stage: 'Group B', status: 'upcoming' },

  // ─────────────── GROUP C  (Brazil · Haiti · Morocco · Scotland) ───────────────
  { id: 'gC1', datetime: '2026-06-13T18:00:00-04:00', home: 'bra', away: 'mar', venue: 'MetLife Stadium, New Jersey',               stage: 'Group C', status: 'upcoming' },
  { id: 'gC2', datetime: '2026-06-13T21:00:00-04:00', home: 'hti', away: 'sco', venue: 'Gillette Stadium, Boston',                  stage: 'Group C', status: 'upcoming' },
  { id: 'gC3', datetime: '2026-06-19T18:00:00-04:00', home: 'sco', away: 'mar', venue: 'Gillette Stadium, Boston',                  stage: 'Group C', status: 'upcoming' },
  { id: 'gC4', datetime: '2026-06-19T20:30:00-04:00', home: 'bra', away: 'hti', venue: 'Lincoln Financial Field, Philadelphia',     stage: 'Group C', status: 'upcoming' },
  { id: 'gC5', datetime: '2026-06-24T18:00:00-04:00', home: 'sco', away: 'bra', venue: 'Hard Rock Stadium, Miami',                  stage: 'Group C', status: 'upcoming' },
  { id: 'gC6', datetime: '2026-06-24T18:00:00-04:00', home: 'mar', away: 'hti', venue: 'Mercedes-Benz Stadium, Atlanta',            stage: 'Group C', status: 'upcoming' },

  // ─────────────── GROUP D  (USA · Turkiye · Australia · Paraguay) ───────────────
  { id: 'gD1', datetime: '2026-06-12T18:00:00-07:00', home: 'usa', away: 'pry', venue: 'SoFi Stadium, Los Angeles',                 stage: 'Group D', status: 'upcoming' },
  { id: 'gD2', datetime: '2026-06-14T00:00:00-04:00', home: 'aus', away: 'tur', venue: 'BC Place, Vancouver',                       stage: 'Group D', status: 'upcoming' },
  { id: 'gD3', datetime: '2026-06-19T12:00:00-07:00', home: 'usa', away: 'aus', venue: 'Lumen Field, Seattle',                      stage: 'Group D', status: 'upcoming' },
  { id: 'gD4', datetime: '2026-06-19T23:00:00-04:00', home: 'tur', away: 'pry', venue: "Levi's Stadium, San Francisco",             stage: 'Group D', status: 'upcoming' },
  { id: 'gD5', datetime: '2026-06-25T19:00:00-07:00', home: 'tur', away: 'usa', venue: 'SoFi Stadium, Los Angeles',                 stage: 'Group D', status: 'upcoming' },
  { id: 'gD6', datetime: '2026-06-25T19:00:00-07:00', home: 'pry', away: 'aus', venue: "Levi's Stadium, San Francisco",             stage: 'Group D', status: 'upcoming' },

  // ─────────────── GROUP E  (Germany · Cote d'Ivoire · Ecuador · Curacao) ───────────────
  { id: 'gE1', datetime: '2026-06-14T13:00:00-04:00', home: 'ger', away: 'cur', venue: 'NRG Stadium, Houston',                      stage: 'Group E', status: 'upcoming' },
  { id: 'gE2', datetime: '2026-06-14T19:00:00-04:00', home: 'civ', away: 'ecu', venue: 'Lincoln Financial Field, Philadelphia',     stage: 'Group E', status: 'upcoming' },
  { id: 'gE3', datetime: '2026-06-20T16:00:00-04:00', home: 'ger', away: 'civ', venue: 'BMO Field, Toronto',                        stage: 'Group E', status: 'upcoming' },
  { id: 'gE4', datetime: '2026-06-20T19:00:00-05:00', home: 'ecu', away: 'cur', venue: 'Arrowhead Stadium, Kansas City',            stage: 'Group E', status: 'upcoming' },
  { id: 'gE5', datetime: '2026-06-25T16:00:00-04:00', home: 'ecu', away: 'ger', venue: 'MetLife Stadium, New Jersey',               stage: 'Group E', status: 'upcoming' },
  { id: 'gE6', datetime: '2026-06-25T16:00:00-04:00', home: 'cur', away: 'civ', venue: 'Lincoln Financial Field, Philadelphia',     stage: 'Group E', status: 'upcoming' },

  // ─────────────── GROUP F  (Netherlands · Tunisia · Japan · Sweden) ───────────────
  { id: 'gF1', datetime: '2026-06-14T15:00:00-05:00', home: 'ned', away: 'jpn', venue: 'AT&T Stadium, Dallas',                      stage: 'Group F', status: 'upcoming' },
  { id: 'gF2', datetime: '2026-06-14T20:00:00-06:00', home: 'swe', away: 'tun', venue: 'Estadio BBVA, Monterrey',                   stage: 'Group F', status: 'upcoming' },
  { id: 'gF3', datetime: '2026-06-20T13:00:00-04:00', home: 'ned', away: 'swe', venue: 'NRG Stadium, Houston',                      stage: 'Group F', status: 'upcoming' },
  { id: 'gF4', datetime: '2026-06-20T23:00:00-05:00', home: 'tun', away: 'jpn', venue: 'Estadio BBVA, Monterrey',                   stage: 'Group F', status: 'upcoming' },
  { id: 'gF5', datetime: '2026-06-25T18:00:00-05:00', home: 'jpn', away: 'swe', venue: 'AT&T Stadium, Dallas',                      stage: 'Group F', status: 'upcoming' },
  { id: 'gF6', datetime: '2026-06-25T18:00:00-05:00', home: 'tun', away: 'ned', venue: 'Arrowhead Stadium, Kansas City',            stage: 'Group F', status: 'upcoming' },

  // ─────────────── GROUP G  (Belgium · New Zealand · Egypt · Iran) ───────────────
  { id: 'gG1', datetime: '2026-06-15T12:00:00-07:00', home: 'bel', away: 'egy', venue: 'Lumen Field, Seattle',                      stage: 'Group G', status: 'upcoming' },
  { id: 'gG2', datetime: '2026-06-15T18:00:00-07:00', home: 'irn', away: 'nzl', venue: 'SoFi Stadium, Los Angeles',                 stage: 'Group G', status: 'upcoming' },
  { id: 'gG3', datetime: '2026-06-21T12:00:00-07:00', home: 'bel', away: 'irn', venue: 'SoFi Stadium, Los Angeles',                 stage: 'Group G', status: 'upcoming' },
  { id: 'gG4', datetime: '2026-06-21T18:00:00-07:00', home: 'nzl', away: 'egy', venue: 'BC Place, Vancouver',                       stage: 'Group G', status: 'upcoming' },
  { id: 'gG5', datetime: '2026-06-26T23:00:00-04:00', home: 'egy', away: 'irn', venue: 'Lumen Field, Seattle',                      stage: 'Group G', status: 'upcoming' },
  { id: 'gG6', datetime: '2026-06-26T23:00:00-04:00', home: 'nzl', away: 'bel', venue: 'BC Place, Vancouver',                       stage: 'Group G', status: 'upcoming' },

  // ─────────────── GROUP H  (Spain · Uruguay · Saudi Arabia · Cabo Verde) ───────────────
  { id: 'gH1', datetime: '2026-06-15T12:00:00-04:00', home: 'esp', away: 'cpv', venue: 'Mercedes-Benz Stadium, Atlanta',            stage: 'Group H', status: 'upcoming' },
  { id: 'gH2', datetime: '2026-06-15T18:00:00-04:00', home: 'ksa', away: 'uru', venue: 'Hard Rock Stadium, Miami',                  stage: 'Group H', status: 'upcoming' },
  { id: 'gH3', datetime: '2026-06-21T12:00:00-04:00', home: 'esp', away: 'ksa', venue: 'Mercedes-Benz Stadium, Atlanta',            stage: 'Group H', status: 'upcoming' },
  { id: 'gH4', datetime: '2026-06-21T18:00:00-04:00', home: 'uru', away: 'cpv', venue: 'Hard Rock Stadium, Miami',                  stage: 'Group H', status: 'upcoming' },
  { id: 'gH5', datetime: '2026-06-26T19:00:00-05:00', home: 'cpv', away: 'ksa', venue: 'NRG Stadium, Houston',                      stage: 'Group H', status: 'upcoming' },
  { id: 'gH6', datetime: '2026-06-26T19:00:00-05:00', home: 'uru', away: 'esp', venue: 'Estadio Akron, Guadalajara',                stage: 'Group H', status: 'upcoming' },

  // ─────────────── GROUP I  (France · Norway · Senegal · Iraq) ───────────────
  { id: 'gI1', datetime: '2026-06-16T15:00:00-04:00', home: 'fra', away: 'sen', venue: 'MetLife Stadium, New Jersey',               stage: 'Group I', status: 'upcoming' },
  { id: 'gI2', datetime: '2026-06-16T18:00:00-04:00', home: 'irq', away: 'nor', venue: 'Gillette Stadium, Boston',                  stage: 'Group I', status: 'upcoming' },
  { id: 'gI3', datetime: '2026-06-22T17:00:00-04:00', home: 'fra', away: 'irq', venue: 'Lincoln Financial Field, Philadelphia',     stage: 'Group I', status: 'upcoming' },
  { id: 'gI4', datetime: '2026-06-22T20:00:00-04:00', home: 'nor', away: 'sen', venue: 'MetLife Stadium, New Jersey',               stage: 'Group I', status: 'upcoming' },
  { id: 'gI5', datetime: '2026-06-26T15:00:00-04:00', home: 'nor', away: 'fra', venue: 'Gillette Stadium, Boston',                  stage: 'Group I', status: 'upcoming' },
  { id: 'gI6', datetime: '2026-06-26T15:00:00-04:00', home: 'sen', away: 'irq', venue: 'BMO Field, Toronto',                        stage: 'Group I', status: 'upcoming' },

  // ─────────────── GROUP J  (Argentina · Jordan · Algeria · Austria) ───────────────
  { id: 'gJ1', datetime: '2026-06-16T21:00:00-04:00', home: 'arg', away: 'alg', venue: 'Arrowhead Stadium, Kansas City',            stage: 'Group J', status: 'upcoming' },
  { id: 'gJ2', datetime: '2026-06-17T00:00:00-04:00', home: 'aut', away: 'jor', venue: "Levi's Stadium, San Francisco",             stage: 'Group J', status: 'upcoming' },
  { id: 'gJ3', datetime: '2026-06-22T12:00:00-05:00', home: 'arg', away: 'aut', venue: 'AT&T Stadium, Dallas',                      stage: 'Group J', status: 'upcoming' },
  { id: 'gJ4', datetime: '2026-06-22T20:00:00-07:00', home: 'jor', away: 'alg', venue: "Levi's Stadium, San Francisco",             stage: 'Group J', status: 'upcoming' },
  { id: 'gJ5', datetime: '2026-06-27T21:00:00-05:00', home: 'alg', away: 'aut', venue: 'Arrowhead Stadium, Kansas City',            stage: 'Group J', status: 'upcoming' },
  { id: 'gJ6', datetime: '2026-06-27T21:00:00-05:00', home: 'jor', away: 'arg', venue: 'AT&T Stadium, Dallas',                      stage: 'Group J', status: 'upcoming' },

  // ─────────────── GROUP K  (Portugal · Uzbekistan · Colombia · Congo DR) ───────────────
  { id: 'gK1', datetime: '2026-06-17T13:00:00-04:00', home: 'por', away: 'cod', venue: 'NRG Stadium, Houston',                      stage: 'Group K', status: 'upcoming' },
  { id: 'gK2', datetime: '2026-06-17T21:00:00-05:00', home: 'uzb', away: 'col', venue: 'Estadio Azteca, Mexico City',               stage: 'Group K', status: 'upcoming' },
  { id: 'gK3', datetime: '2026-06-23T13:00:00-04:00', home: 'por', away: 'uzb', venue: 'NRG Stadium, Houston',                      stage: 'Group K', status: 'upcoming' },
  { id: 'gK4', datetime: '2026-06-23T21:00:00-05:00', home: 'col', away: 'cod', venue: 'Estadio Akron, Guadalajara',                stage: 'Group K', status: 'upcoming' },
  { id: 'gK5', datetime: '2026-06-27T19:30:00-04:00', home: 'col', away: 'por', venue: 'Hard Rock Stadium, Miami',                  stage: 'Group K', status: 'upcoming' },
  { id: 'gK6', datetime: '2026-06-27T19:30:00-04:00', home: 'cod', away: 'uzb', venue: 'Mercedes-Benz Stadium, Atlanta',            stage: 'Group K', status: 'upcoming' },

  // ─────────────── GROUP L  (England · Croatia · Ghana · Panama) ───────────────
  { id: 'gL1', datetime: '2026-06-17T15:00:00-05:00', home: 'eng', away: 'cro', venue: 'AT&T Stadium, Dallas',                      stage: 'Group L', status: 'upcoming' },
  { id: 'gL2', datetime: '2026-06-17T19:00:00-04:00', home: 'gha', away: 'pan', venue: 'BMO Field, Toronto',                        stage: 'Group L', status: 'upcoming' },
  { id: 'gL3', datetime: '2026-06-23T16:00:00-04:00', home: 'eng', away: 'gha', venue: 'Gillette Stadium, Boston',                  stage: 'Group L', status: 'upcoming' },
  { id: 'gL4', datetime: '2026-06-23T19:00:00-04:00', home: 'pan', away: 'cro', venue: 'BMO Field, Toronto',                        stage: 'Group L', status: 'upcoming' },
  { id: 'gL5', datetime: '2026-06-27T17:00:00-04:00', home: 'pan', away: 'eng', venue: 'MetLife Stadium, New Jersey',               stage: 'Group L', status: 'upcoming' },
  { id: 'gL6', datetime: '2026-06-27T17:00:00-04:00', home: 'cro', away: 'gha', venue: 'Lincoln Financial Field, Philadelphia',     stage: 'Group L', status: 'upcoming' },

  // ─────────────── ROUND OF 32  (Jun 28 – Jul 3) ───────────────
  { id: 'r32a', datetime: '2026-06-28T15:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'MetLife Stadium, New Jersey',              stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32b', datetime: '2026-06-29T13:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'SoFi Stadium, Los Angeles',                stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32c', datetime: '2026-06-29T16:30:00-04:00', home: 'tbd', away: 'tbd', venue: 'SoFi Stadium, Los Angeles',                stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32d', datetime: '2026-06-29T20:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'AT&T Stadium, Dallas',                     stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32e', datetime: '2026-06-30T13:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Estadio Azteca, Mexico City',              stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32f', datetime: '2026-06-30T16:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'Estadio Azteca, Mexico City',              stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32g', datetime: '2026-06-30T12:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Estadio BBVA, Monterrey',                  stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32h', datetime: '2026-06-30T16:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'MetLife Stadium, New Jersey',              stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32i', datetime: '2026-06-30T21:30:00-05:00', home: 'tbd', away: 'tbd', venue: 'Estadio BBVA, Monterrey',                  stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32j', datetime: '2026-07-01T12:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'Arrowhead Stadium, Kansas City',           stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32k', datetime: '2026-07-01T16:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Lincoln Financial Field, Philadelphia',    stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32l', datetime: '2026-07-02T12:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'BMO Field, Toronto',                       stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32m', datetime: '2026-07-02T16:00:00-07:00', home: 'tbd', away: 'tbd', venue: 'BC Place, Vancouver',                      stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32n', datetime: '2026-07-03T12:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Hard Rock Stadium, Miami',                 stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32o', datetime: '2026-07-03T21:30:00-05:00', home: 'tbd', away: 'tbd', venue: 'Arrowhead Stadium, Kansas City',           stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32p', datetime: '2026-07-03T21:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'AT&T Stadium, Dallas',                     stage: 'Round of 32', status: 'upcoming' },

  // ─────────────── ROUND OF 16  (Jul 4–7) ───────────────
  { id: 'r16a', datetime: '2026-07-04T13:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'NRG Stadium, Houston',                     stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16b', datetime: '2026-07-04T17:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Lincoln Financial Field, Philadelphia',    stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16c', datetime: '2026-07-05T16:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'MetLife Stadium, New Jersey',              stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16d', datetime: '2026-07-05T20:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'Estadio Azteca, Mexico City',              stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16e', datetime: '2026-07-06T15:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'AT&T Stadium, Dallas',                     stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16f', datetime: '2026-07-06T17:00:00-07:00', home: 'tbd', away: 'tbd', venue: 'Lumen Field, Seattle',                     stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16g', datetime: '2026-07-07T12:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Mercedes-Benz Stadium, Atlanta',           stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16h', datetime: '2026-07-07T16:00:00-07:00', home: 'tbd', away: 'tbd', venue: 'BC Place, Vancouver',                      stage: 'Round of 16', status: 'upcoming' },

  // ─────────────── QUARTER-FINALS  (Jul 9–11) ───────────────
  { id: 'qf1',  datetime: '2026-07-09T16:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Gillette Stadium, Boston',                 stage: 'Quarter-final', status: 'upcoming' },
  { id: 'qf2',  datetime: '2026-07-10T12:00:00-07:00', home: 'tbd', away: 'tbd', venue: 'SoFi Stadium, Los Angeles',                stage: 'Quarter-final', status: 'upcoming' },
  { id: 'qf3',  datetime: '2026-07-11T17:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Hard Rock Stadium, Miami',                 stage: 'Quarter-final', status: 'upcoming' },
  { id: 'qf4',  datetime: '2026-07-11T20:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'Arrowhead Stadium, Kansas City',           stage: 'Quarter-final', status: 'upcoming' },

  // ─────────────── SEMI-FINALS  (Jul 14–15) ───────────────
  { id: 'sf1',  datetime: '2026-07-14T14:00:00-05:00', home: 'tbd', away: 'tbd', venue: 'AT&T Stadium, Dallas',                     stage: 'Semi-final', status: 'upcoming' },
  { id: 'sf2',  datetime: '2026-07-15T15:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Mercedes-Benz Stadium, Atlanta',           stage: 'Semi-final', status: 'upcoming' },

  // ─────────────── THIRD PLACE & FINAL ───────────────
  { id: 'tp',   datetime: '2026-07-18T17:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'Hard Rock Stadium, Miami',                 stage: 'Third Place', status: 'upcoming' },
  { id: 'fin',  datetime: '2026-07-19T15:00:00-04:00', home: 'tbd', away: 'tbd', venue: 'MetLife Stadium, New Jersey',              stage: 'Final', status: 'upcoming' },
];

const ALL_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const NAV_LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'Matches',   href: '#matches' },
  { label: 'Live',      href: '#live-tracker' },
  { label: 'Knockouts', href: '#round-of-32' },
  { label: 'Teams',     href: '#teams' },
  { label: 'Stadiums',  href: '#stadiums' },
  { label: 'Stats',     href: '#stats' },
  { label: 'Search',    href: '#search' },
  { label: 'Standings', href: '#standings' },
  { label: 'Favorites', href: '#favorites' },
];

const TEAM_DETAILS = Object.fromEntries(
  Object.entries(TEAMS).map(([key, team]) => [
    key,
    {
      coach: 'TBD',
      bestFinish: team.participations > 0 ? 'TBD' : 'Debut appearance',
      squad: ['Squad will be announced closer to the tournament'],
    },
  ])
);

const STADIUMS = [
  { name: 'MetLife Stadium', location: 'New Jersey', capacity: '82,500', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/MetLife_Stadium_%28Aerial_view%29.jpg/960px-MetLife_Stadium_%28Aerial_view%29.jpg' },
  { name: 'AT&T Stadium', location: 'Dallas', capacity: '80,000', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cowboys_Stadium_field.jpg/960px-Cowboys_Stadium_field.jpg' },
  { name: 'SoFi Stadium', location: 'Los Angeles', capacity: '70,240', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/SoFi_Stadium_2021.jpg/960px-SoFi_Stadium_2021.jpg' },
  { name: 'Hard Rock Stadium', location: 'Miami', capacity: '65,326', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hard_Rock_Stadium_2020.jpg/960px-Hard_Rock_Stadium_2020.jpg' },
  { name: 'Estadio Azteca', location: 'Mexico City', capacity: '87,523', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Estadio_Azteca_1706p2.jpg/960px-Estadio_Azteca_1706p2.jpg' },
  { name: 'BMO Field', location: 'Toronto', capacity: '45,736', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/BMO_Field_2016.jpg/960px-BMO_Field_2016.jpg' },
  { name: 'BC Place', location: 'Vancouver', capacity: '54,500', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/BC_Place_2011.jpg/960px-BC_Place_2011.jpg' },
  { name: 'Lumen Field', location: 'Seattle', capacity: '68,740', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Lumen_Field_2021.jpg/960px-Lumen_Field_2021.jpg' },
];

const TOURNAMENT_STATS = {
  totalGoals: 0,
  cleanSheets: 0,
  yellowCards: 0,
  redCards: 0,
  topScorer: 'TBD',
};

const TOP_SCORERS = [];
const ASSISTS_LEADERS = [];
const PLAYER_INDEX = ['Messi', 'Lautaro', 'Vinicius', 'Mbappe', 'Kane', 'De Bruyne', 'Musiala'];

function pad(n) { return String(n).padStart(2, '0'); }

function calcCountdown(target) {
  const diff = new Date(target) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

function useCountdown(targetDate) {
  const [time, setTime] = useState(() => calcCountdown(targetDate));
  useEffect(() => {
    const id = setInterval(() => setTime(calcCountdown(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function formatISTDate(datetime) {
  return new Date(datetime).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatISTTime(datetime) {
  return (
    new Date(datetime).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }) + ' IST'
  );
}

function getMatchDateIST(datetime) {
  return new Date(datetime).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function loadFavorites() {
  try {
    if (typeof localStorage === 'undefined') return new Set();
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function getMatchStatus(datetime, now) {
  const kick = new Date(datetime);
  const end  = new Date(kick.getTime() + 2 * 3600_000);
  if (now < kick) return 'upcoming';
  if (now < end)  return 'live';
  return 'finished';
}

function sortMatchesByKickoff(matches) {
  return [...matches].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

function getStadiumName(venue) {
  return venue.split(',')[0].trim();
}

function getStadiumMatches(stadiumName) {
  return MATCHES.filter(match => getStadiumName(match.venue) === stadiumName);
}

function getTeamFixtures(teamKey) {
  return sortMatchesByKickoff(MATCHES.filter(match => match.home === teamKey || match.away === teamKey));
}

function getLiveMatchDetails(match) {
  const home = TEAMS[match.home]?.name || 'TBD';
  const away = TEAMS[match.away]?.name || 'TBD';
  return {
    scoreline: `${home} 0 - 0 ${away}`,
    minute: '0',
    goals: [],
    yellowCards: [],
    redCards: [],
    events: [],
  };
}

function getGroupPrediction(group) {
  return Object.values(TEAMS)
    .filter(team => team.group === group)
    .sort((a, b) => a.ranking - b.ranking)
    .map((team, index) => ({ team, predictedPoints: 0, qualified: index < 2 }));
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ activeSection }) {
  return (
    <nav className="navbar glass">
      <a href="#home" className="navbar__brand">
        <span className="navbar__logo">
          <img src={monkLogo} alt="FIFA World Cup Monk logo" />
        </span>
        <span className="navbar__brand-text">
          <span className="navbar__brand-title">FIFA World Cup Monk</span>
          <span className="navbar__brand-sub">FIFA 2026</span>
        </span>
      </a>
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={`navbar__link ${activeSection === link.href ? 'navbar__link--active' : ''}`}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const cd = useCountdown(WORLD_CUP_START);
  return (
    <section id="home" className="hero">
      <div className="hero__badge">FIFA World Cup 2026 | USA | Mexico | Canada</div>
      <h1 className="hero__title">
        FIFA World Cup <span className="hero__title-accent">Monk</span>
      </h1>
      <p className="hero__subtitle">Track Every Match. Every Team. Every Moment.</p>
      <div className="hero__countdown glass">
        <p className="hero__countdown-label">
          {cd.done ? 'World Cup 2026 has begun!' : 'Countdown to Kick-Off'}
        </p>
        <div className="hero__countdown-grid">
          {[
            { label: 'Days',    value: cd.days },
            { label: 'Hours',   value: cd.hours },
            { label: 'Minutes', value: cd.minutes },
            { label: 'Seconds', value: cd.seconds },
          ].map((unit) => (
            <div key={unit.label} className="hero__countdown-unit">
              <span className="hero__countdown-value">{pad(unit.value)}</span>
              <span className="hero__countdown-unit-label">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>
      <a href="#matches" className="hero__cta">
        Explore Matches
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}

const FLAG_ASSET_CODES = {
  ALG: 'dz', ARG: 'ar', AUS: 'au', AUT: 'at', BEL: 'be', BIH: 'ba',
  BRA: 'br', CPV: 'cv', CAN: 'ca', COL: 'co', COD: 'cd', CIV: 'ci',
  CRO: 'hr', CUR: 'cw', CZE: 'cz', ECU: 'ec', EGY: 'eg', ENG: 'gb-eng',
  FRA: 'fr', GER: 'de', GHA: 'gh', HTI: 'ht', IRN: 'ir', IRQ: 'iq',
  JPN: 'jp', JOR: 'jo', KOR: 'kr', MAR: 'ma', MEX: 'mx', NZL: 'nz',
  NED: 'nl', NOR: 'no', PAN: 'pa', PRY: 'py', POR: 'pt', QAT: 'qa',
  KSA: 'sa', SCO: 'gb-sct', SEN: 'sn', ZAF: 'za', ESP: 'es', SWE: 'se',
  SUI: 'ch', TUN: 'tn', TUR: 'tr', URU: 'uy', USA: 'us', UZB: 'uz',
};

function FlagEmoji({ team, className = '' }) {
  const flagCode = FLAG_ASSET_CODES[team.code];
  return (
    <img
      className={className}
      src={`https://flagcdn.com/${flagCode}.svg`}
      alt={`${team.name} flag`}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}

function StarButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      className={`star-btn ${active ? 'star-btn--active' : ''}`}
      onClick={onClick}
      aria-label={active ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
    >
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── MatchCard ───────────────────────────────────────────────────────────────
function MatchCard({ match, favorites, onToggleFavorite, style, now }) {
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];

  if (!home || !away) {
    return (
      <article className="match-card glass match-card--tbd" style={style}>
        <div className="match-card__header">
          <span className="match-card__stage">{match.stage}</span>
          <span className="match-card__timer">{formatISTDate(match.datetime)}</span>
        </div>
        <div className="match-card__teams match-card__teams--tbd">
          <span className="match-card__tbd">TBD</span>
          <div className="match-card__divider"><span className="match-card__vs">VS</span></div>
          <span className="match-card__tbd">TBD</span>
        </div>
        <div className="match-card__meta">
          <div className="match-card__meta-item match-card__meta-item--venue">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{match.venue}</span>
          </div>
          <div className="match-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{formatISTTime(match.datetime)}</span>
          </div>
        </div>
      </article>
    );
  }

  const status = getMatchStatus(match.datetime, now);
  const cd = useCountdown(match.datetime);
  const timer =
    status === 'live'     ? 'LIVE NOW' :
    status === 'finished' ? 'Finished' :
    cd.done               ? 'Starting soon' :
    cd.days > 0           ? `${cd.days}d ${pad(cd.hours)}h` :
                            `${pad(cd.hours)}:${pad(cd.minutes)}:${pad(cd.seconds)}`;
  const liveDetails = status === 'live' ? getLiveMatchDetails(match) : null;

  return (
    <article className={`match-card glass ${status === 'live' ? 'match-card--live' : ''}`} style={style}>
      <div className="match-card__header">
        <span className="match-card__stage">{match.stage}</span>
        <span className={`match-card__timer ${status === 'live' ? 'match-card__timer--live' : ''}`}>
          {status === 'live' && <span className="match-card__pulse" aria-hidden="true" />}
          <span aria-live="polite" aria-atomic="true">{timer}</span>
        </span>
      </div>

      <div className="match-card__teams">
        <div className="match-card__team">
          <StarButton active={favorites.has(home.code)} onClick={() => onToggleFavorite(home.code)} label={home.name} />
          <span className="match-card__name">{home.name}</span>
          <FlagEmoji team={home} className="match-card__flag" />
        </div>
        <div className="match-card__divider">
          <span className="match-card__vs">VS</span>
        </div>
        <div className="match-card__team">
          <StarButton active={favorites.has(away.code)} onClick={() => onToggleFavorite(away.code)} label={away.name} />
          <span className="match-card__name">{away.name}</span>
          <FlagEmoji team={away} className="match-card__flag" />
        </div>
      </div>

      <div className="match-card__meta">
        <div className="match-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>{formatISTDate(match.datetime)}</span>
        </div>
        <div className="match-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{formatISTTime(match.datetime)}</span>
        </div>
        <div className="match-card__meta-item match-card__meta-item--venue">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>{match.venue}</span>
        </div>
      </div>

      {liveDetails && (
        <div className="live-tracker">
          <div className="live-tracker__score">{liveDetails.scoreline}</div>
          <div className="live-tracker__minute">{liveDetails.minute}</div>
          <div className="live-tracker__grid">
            <div><span>Goals</span><strong>{liveDetails.goals.length}</strong></div>
            <div><span>Yellow</span><strong>{liveDetails.yellowCards.length}</strong></div>
            <div><span>Red</span><strong>{liveDetails.redCards.length}</strong></div>
            <div><span>Events</span><strong>{liveDetails.events.length}</strong></div>
          </div>
          <p className="live-tracker__note">Live event feed ready. Stats will update during matches.</p>
        </div>
      )}
    </article>
  );
}

// ─── MatchSection ─────────────────────────────────────────────────────────────
function MatchSection({ id, title, subtitle, matches, favorites, onToggleFavorite, now,
                        hasMore, onShowMore, totalCount, showMoreLabel = 'Load 20 more fixtures',
                        gridClassName = '', sectionClassName = '' }) {
  return (
    <section id={id} className={`section ${sectionClassName}`}>
      <div className="section__header">
        <div>
          <h2 className="section__title">{title}</h2>
          <p className="section__subtitle">{subtitle}</p>
        </div>
        <span className="section__count">
          Showing {matches.length}{totalCount ? ` of ${totalCount}` : ''} match{matches.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="section__empty glass"><p>No matches to show right now.</p></div>
      ) : (
        <>
          <div className={`section__grid ${gridClassName}`}>
            {matches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                style={{ animationDelay: `${index * 0.07}s` }}
                now={now}
              />
            ))}
          </div>
          {hasMore && (
            <div className="section__pagination">
              <button type="button" className="show-more-btn show-more-btn--matches" onClick={onShowMore}>
                <span className="show-more-btn__spark" aria-hidden="true">+</span>
                <span className="show-more-btn__text">{showMoreLabel}</span>
                <span className="show-more-btn__arrow" aria-hidden="true">&gt;</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── GroupTable ───────────────────────────────────────────────────────────────
function GroupTable({ group }) {
  const standings = Object.values(TEAMS)
    .filter(t => t.group === group)
    .map(team => ({
      team,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.team.ranking - b.team.ranking
    );

  return (
    <div className="group-table glass">
      <h3>Group {group}</h3>
      <table>
        <thead>
          <tr>
            <th>Pos</th><th>Team</th><th>MP</th><th>W</th><th>D</th>
            <th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(({ team, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points }, index) => (
            <tr key={team.code}>
              <td>{index + 1}</td>
              <td><FlagEmoji team={team} className="inline-flag" /> {team.name}</td>
              <td>{played}</td><td>{won}</td><td>{drawn}</td><td>{lost}</td>
              <td>{goalsFor}</td><td>{goalsAgainst}</td><td>{goalDifference}</td><td>{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── StandingsSection ─────────────────────────────────────────────────────────
function StandingsSection() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="standings" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Group Standings</h2>
          <p className="section__subtitle">Official FIFA World Cup 2026 Groups</p>
        </div>
        <button type="button" className="show-more-btn" onClick={() => setShowAll(v => !v)}>
          {showAll ? 'Show one group' : 'Show all groups'}
        </button>
      </div>

      {!showAll && (
        <div className="teams-filter" style={{ marginBottom: '1.5rem' }}>
          {ALL_GROUPS.map(g => (
            <button key={g} className={`group-pill ${activeGroup === g ? 'active' : ''}`} onClick={() => setActiveGroup(g)}>
              Group {g}
            </button>
          ))}
        </div>
      )}

      {showAll ? (
        <div className="groups-grid">
          {ALL_GROUPS.map(group => <GroupTable key={group} group={group} />)}
        </div>
      ) : (
        <GroupTable group={activeGroup} />
      )}
    </section>
  );
}

function TeamDetailModal({ teamKey, onClose }) {
  const team = TEAMS[teamKey];
  const detail = TEAM_DETAILS[teamKey];
  const fixtures = getTeamFixtures(teamKey);
  if (!team) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="team-detail glass" role="dialog" aria-modal="true" aria-label={`${team.name} details`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close team details">×</button>
        <div className="team-detail__header">
          <FlagEmoji team={team} className="team-detail__flag" />
          <div>
            <h3>{team.name}</h3>
            <p>Group {team.group} | FIFA Rank #{team.ranking}</p>
          </div>
        </div>
        <div className="team-detail__grid">
          <div><span>Coach</span><strong>{detail.coach}</strong></div>
          <div><span>WC Appearances</span><strong>{team.participations}</strong></div>
          <div><span>Best Finish</span><strong>{detail.bestFinish}</strong></div>
          <div><span>Squad</span><strong>{detail.squad[0]}</strong></div>
        </div>
        <h4>Upcoming fixtures</h4>
        <ul className="team-detail__fixtures">
          {fixtures.slice(0, 6).map(match => {
            const opponentKey = match.home === teamKey ? match.away : match.home;
            const opponent = TEAMS[opponentKey];
            return (
              <li key={match.id}>
                <span>{formatISTDate(match.datetime)}</span>
                <strong>{opponent ? opponent.name : 'TBD'}</strong>
                <em>{match.stage}</em>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ─── TeamsSection ─────────────────────────────────────────────────────────────
function TeamsSection({ favorites, onToggleFavorite, now }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamKey, setSelectedTeamKey] = useState(null);
  const groups = ['all', ...ALL_GROUPS];

  const teams = useMemo(() => {
    let all = Object.values(TEAMS);
    if (filter !== 'all') all = all.filter(t => t.group === filter);
    if (searchTerm.trim()) all = all.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return all.sort((a, b) => a.name.localeCompare(b.name));
  }, [filter, searchTerm]);

  const groupMatches = useMemo(() => {
    if (filter === 'all') return [];
    return sortMatchesByKickoff(MATCHES.filter(match => match.stage === `Group ${filter}`));
  }, [filter]);

  return (
    <section id="teams" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Teams</h2>
          <p className="section__subtitle">All 48 competing nations — star your favorites</p>
        </div>
        <span className="section__count">{teams.length} teams</span>
      </div>

      <div className="search-box glass">
        <input type="text" placeholder="Search teams..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      </div>

      <div className="teams-filter">
        {groups.map((group) => (
          <button key={group} className={`group-pill ${filter === group ? 'active' : ''}`} onClick={() => setFilter(group)}>
            {group === 'all' ? 'All Teams' : `Group ${group}`}
          </button>
        ))}
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.code} className={`team-card glass ${team.host ? 'team-card--host' : ''}`}>
            <button
              type="button"
              className="team-card__open"
              onClick={() => setSelectedTeamKey(Object.keys(TEAMS).find(key => TEAMS[key].code === team.code))}
              aria-label={`Open ${team.name} details`}
            >
              <div className="team-card__flag-box">
                <FlagEmoji team={team} className="team-card__flag" />
              </div>
              <div className="team-card__info">
                <div className="team-card__name">
                  {team.name}
                  {team.host && <span className="team-card__host-badge">HOST</span>}
                </div>
                <div className="team-card__meta">Group {team.group} | FIFA Rank #{team.ranking}</div>
                <div className="team-card__stats">{team.participations} WC Appearances</div>
              </div>
            </button>
            <StarButton active={favorites.has(team.code)} onClick={() => onToggleFavorite(team.code)} label={team.name} />
          </div>
        ))}
      </div>

      {filter !== 'all' && (
        <div className="teams-group-matches">
          <MatchSection
            id={`group-${filter.toLowerCase()}-matches`}
            title={`Group ${filter} Matches`}
            subtitle={`All Group ${filter} fixtures in chronological order (IST)`}
            matches={groupMatches}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            now={now}
          />
        </div>
      )}

      {selectedTeamKey && (
        <TeamDetailModal teamKey={selectedTeamKey} onClose={() => setSelectedTeamKey(null)} />
      )}
    </section>
  );
}

// ─── FavoritesSection ─────────────────────────────────────────────────────────
function FavoritesSection({ favorites, onToggleFavorite, now }) {
  const favoriteTeams = Object.values(TEAMS).filter(t => favorites.has(t.code));
  const favoriteMatches = sortMatchesByKickoff(MATCHES.filter(m => {
    const home = TEAMS[m.home];
    const away = TEAMS[m.away];
    return home && away && (favorites.has(home.code) || favorites.has(away.code));
  }));

  return (
    <section id="favorites" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Favorites</h2>
          <p className="section__subtitle">Your starred teams and their fixtures</p>
        </div>
        <span className="section__count">{favoriteTeams.length} teams</span>
      </div>

      {favoriteTeams.length === 0 ? (
        <div className="section__empty glass">
          <p>Star teams from match cards or the Teams section to see them here.</p>
        </div>
      ) : (
        <>
          <div className="favorites-chips">
            {favoriteTeams.map(team => (
              <span key={team.code} className="favorites-chip">
                <FlagEmoji team={team} className="inline-flag" /> {team.name}
                <button type="button" onClick={() => onToggleFavorite(team.code)} aria-label={`Remove ${team.name}`}>×</button>
              </span>
            ))}
          </div>
          <div className="section__grid">
            {favoriteMatches.length === 0 ? (
              <div className="section__empty glass"><p>No upcoming fixtures for your favorite teams.</p></div>
            ) : (
              favoriteMatches.map(match => (
                <MatchCard key={match.id} match={match} favorites={favorites} onToggleFavorite={onToggleFavorite} now={now} />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

function LiveTrackerSection({ favorites, onToggleFavorite, now }) {
  const liveMatches = MATCHES.filter(match => getMatchStatus(match.datetime, now) === 'live');
  return (
    <section id="live-tracker" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Live Match Tracker</h2>
          <p className="section__subtitle">Live score, goals, cards, and match events.</p>
        </div>
        <span className="section__count">{liveMatches.length} live</span>
      </div>
      {liveMatches.length === 0 ? (
        <div className="feature-note glass">
          <strong>No match is live right now.</strong>
          <p>When a match is live, its card will show scoreline, minute, goals, cards, and match events.</p>
        </div>
      ) : (
        <div className="section__grid">
          {liveMatches.map(match => (
            <MatchCard key={match.id} match={match} favorites={favorites} onToggleFavorite={onToggleFavorite} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

function StadiumExplorer() {
  return (
    <section id="stadiums" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Stadium Explorer</h2>
          <p className="section__subtitle">Host venues with maps, images, capacity, and match counts.</p>
        </div>
        <span className="section__count">{STADIUMS.length} stadiums</span>
      </div>
      <div className="stadium-grid">
        {STADIUMS.map(stadium => {
          const hosted = getStadiumMatches(stadium.name).length;
          const mapQuery = encodeURIComponent(`${stadium.name} ${stadium.location}`);
          return (
            <article key={stadium.name} className="stadium-card glass">
              <img src={stadium.photo} alt={`${stadium.name} stadium`} loading="lazy" decoding="async"
                onError={(event) => { event.currentTarget.src = stadiumFallback; }} />
              <div className="stadium-card__body">
                <h3>{stadium.name}</h3>
                <dl>
                  <div><dt>Capacity</dt><dd>{stadium.capacity}</dd></div>
                  <div><dt>Location</dt><dd>{stadium.location}</dd></div>
                  <div><dt>Matches Hosted</dt><dd>{hosted}</dd></div>
                </dl>
                <iframe title={`${stadium.name} map`} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GlobalSearchSection() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    const teams = Object.entries(TEAMS)
      .filter(([, team]) => team.name.toLowerCase().includes(normalizedQuery) || team.code.toLowerCase().includes(normalizedQuery))
      .map(([key, team]) => ({ type: 'Team', key, title: team.name, detail: `Group ${team.group} | Rank #${team.ranking}` }));

    const stadiums = STADIUMS
      .filter(stadium => `${stadium.name} ${stadium.location}`.toLowerCase().includes(normalizedQuery))
      .map(stadium => ({ type: 'Stadium', key: stadium.name, title: stadium.name, detail: stadium.location }));

    const matches = MATCHES
      .filter(match => {
        const home = TEAMS[match.home]?.name || 'TBD';
        const away = TEAMS[match.away]?.name || 'TBD';
        return `${home} ${away} ${match.stage} ${match.venue}`.toLowerCase().includes(normalizedQuery);
      })
      .slice(0, 10)
      .map(match => ({
        type: 'Match',
        key: match.id,
        title: `${TEAMS[match.home]?.name || 'TBD'} vs ${TEAMS[match.away]?.name || 'TBD'}`,
        detail: `${match.stage} | ${formatISTDate(match.datetime)} | ${formatISTTime(match.datetime)}`,
      }));

    const players = PLAYER_INDEX
      .filter(player => player.toLowerCase().includes(normalizedQuery))
      .map(player => ({ type: 'Player', key: player, title: player, detail: 'Player profile placeholder' }));

    return [...teams, ...players, ...stadiums, ...matches];
  }, [normalizedQuery]);

  return (
    <section id="search" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Search Everywhere</h2>
          <p className="section__subtitle">Search teams, players, stadiums, and matches from one place.</p>
        </div>
        <span className="section__count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="search-box glass search-box--wide">
        <input type="text" placeholder="Search teams, players, stadiums, matches..."
          value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
      </div>
      <div className="search-results">
        {normalizedQuery && results.length === 0 && <div className="section__empty glass"><p>No results found.</p></div>}
        {results.map(result => (
          <article key={`${result.type}-${result.key}`} className="search-result glass">
            <span>{result.type}</span>
            <strong>{result.title}</strong>
            <p>{result.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TournamentStatsSection() {
  return (
    <section id="stats" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Tournament Stats</h2>
          <p className="section__subtitle">Live stats will update once the tournament begins.</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card glass"><span>⚽</span><p>Total Goals</p><strong>{TOURNAMENT_STATS.totalGoals}</strong></div>
        <div className="stat-card glass"><span>🧤</span><p>Clean Sheets</p><strong>{TOURNAMENT_STATS.cleanSheets}</strong></div>
        <div className="stat-card glass"><span>🟨</span><p>Yellow Cards</p><strong>{TOURNAMENT_STATS.yellowCards}</strong></div>
        <div className="stat-card glass"><span>🟥</span><p>Red Cards</p><strong>{TOURNAMENT_STATS.redCards}</strong></div>
        <div className="stat-card glass"><span>🏅</span><p>Top Scorer</p><strong>{TOURNAMENT_STATS.topScorer}</strong></div>
      </div>
      <div className="leaderboard-grid">
        <Leaderboard title="Top Scorers" rows={TOP_SCORERS} emptyText="No goals yet" />
        <Leaderboard title="Assists Leaderboard" rows={ASSISTS_LEADERS} emptyText="No assists yet" />
      </div>
    </section>
  );
}

function Leaderboard({ title, rows, emptyText }) {
  return (
    <article className="leaderboard glass">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p>{emptyText}</p>
      ) : (
        <ol>{rows.map(row => <li key={row.name}>{row.name} - {row.value}</li>)}</ol>
      )}
    </article>
  );
}

function GroupPredictionSection() {
  const [activeGroup, setActiveGroup] = useState('A');
  const prediction = getGroupPrediction(activeGroup);

  return (
    <section id="predictor" className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">Group Qualification Predictor</h2>
          <p className="section__subtitle">Predicted by FIFA ranking. Points will update live once the tournament begins.</p>
        </div>
      </div>
      <div className="teams-filter">
        {ALL_GROUPS.map(group => (
          <button type="button" key={group}
            className={`group-pill ${activeGroup === group ? 'active' : ''}`}
            onClick={() => setActiveGroup(group)}>
            Group {group}
          </button>
        ))}
      </div>
      <div className="predictor-card glass">
        <h3>Group {activeGroup}</h3>
        <ol>
          {prediction.map(row => (
            <li key={row.team.code}>
              <span><FlagEmoji team={row.team} className="inline-flag" /> {row.team.name}</span>
              <strong>{row.predictedPoints} pts</strong>
              {row.qualified && <em>Projected Top 2</em>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [favorites, setFavorites] = useState(loadFavorites);
  const [now, setNow] = useState(() => new Date());
  const [upcomingVisible, setUpcomingVisible] = useState(6);
  const [expandedKnockouts, setExpandedKnockouts] = useState({
    roundOf32: false,
    roundOf16: false,
    quarterFinals: false,
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(() => now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), [now]);

  const todaysMatches = useMemo(
    () => sortMatchesByKickoff(MATCHES.filter(m => getMatchDateIST(m.datetime) === today)),
    [today]
  );

  const allUpcomingMatches = useMemo(
    () => sortMatchesByKickoff(MATCHES.filter(m => getMatchStatus(m.datetime, now) === 'upcoming')),
    [now]
  );

  const upcomingMatches = useMemo(
    () => allUpcomingMatches.slice(0, upcomingVisible),
    [allUpcomingMatches, upcomingVisible]
  );

  const hasMoreUpcoming = upcomingVisible < allUpcomingMatches.length;

  const roundOf32Matches  = useMemo(() => sortMatchesByKickoff(MATCHES.filter(m => m.stage === 'Round of 32')), []);
  const roundOf16Matches  = useMemo(() => sortMatchesByKickoff(MATCHES.filter(m => m.stage === 'Round of 16')), []);
  const quarterFinalMatches = useMemo(() => sortMatchesByKickoff(MATCHES.filter(m => m.stage === 'Quarter-final')), []);
  const semiFinalMatches  = useMemo(() => sortMatchesByKickoff(MATCHES.filter(m => m.stage === 'Semi-final')), []);
  const finalMatches      = useMemo(() => sortMatchesByKickoff(MATCHES.filter(m => m.stage === 'Final')), []);

  const displayedRoundOf32Matches    = expandedKnockouts.roundOf32    ? roundOf32Matches    : roundOf32Matches.slice(0, 3);
  const displayedRoundOf16Matches    = expandedKnockouts.roundOf16    ? roundOf16Matches    : roundOf16Matches.slice(0, 3);
  const displayedQuarterFinalMatches = expandedKnockouts.quarterFinals ? quarterFinalMatches : quarterFinalMatches.slice(0, 3);

  function showAllKnockoutMatches(stage) {
    setExpandedKnockouts(prev => ({ ...prev, [stage]: true }));
  }

  function toggleFavorite(code) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__grid" />
        <div className="app__glow app__glow--blue" />
        <div className="app__glow app__glow--gold" />
        <div className="app__ball app__ball--1"><img src={monkLogo} alt="" /></div>
        <div className="app__ball app__ball--2"><img src={monkLogo} alt="" /></div>
      </div>

      <Navbar activeSection="#home" />

      <main className="app__main">
        <Hero />

        <div id="matches" className="matches-wrapper">
          <LiveTrackerSection favorites={favorites} onToggleFavorite={toggleFavorite} now={now} />

          <MatchSection
            id="today"
            title="Today's Matches"
            subtitle="Live and scheduled today (IST)"
            matches={todaysMatches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
          />

          <MatchSection
            id="upcoming"
            title="Upcoming Matches"
            subtitle="All upcoming FIFA World Cup 2026 fixtures — times shown in IST"
            matches={upcomingMatches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            hasMore={hasMoreUpcoming}
            onShowMore={() => setUpcomingVisible(v => v + 20)}
            totalCount={allUpcomingMatches.length}
          />

          <MatchSection
            id="round-of-32"
            title="Round of 32"
            subtitle="28 June – 3 July 2026 | First-ever knockout round at a World Cup"
            matches={displayedRoundOf32Matches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            hasMore={!expandedKnockouts.roundOf32 && roundOf32Matches.length > 3}
            onShowMore={() => showAllKnockoutMatches('roundOf32')}
            showMoreLabel={`Show all ${roundOf32Matches.length} matches`}
            totalCount={roundOf32Matches.length}
          />

          <MatchSection
            id="round-of-16"
            title="Round of 16"
            subtitle="4–7 July 2026 | The last 16 teams continue the knockout path"
            matches={displayedRoundOf16Matches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            hasMore={!expandedKnockouts.roundOf16 && roundOf16Matches.length > 3}
            onShowMore={() => showAllKnockoutMatches('roundOf16')}
            showMoreLabel={`Show all ${roundOf16Matches.length} matches`}
            totalCount={roundOf16Matches.length}
          />

          <MatchSection
            id="quarter-finals"
            title="Quarter Finals"
            subtitle="9–11 July 2026 | Eight teams, four high-stakes fixtures"
            matches={displayedQuarterFinalMatches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            hasMore={!expandedKnockouts.quarterFinals && quarterFinalMatches.length > 3}
            onShowMore={() => showAllKnockoutMatches('quarterFinals')}
            showMoreLabel={`Show all ${quarterFinalMatches.length} matches`}
            totalCount={quarterFinalMatches.length}
          />

          <MatchSection
            id="semi-finals"
            title="Semi Finals"
            subtitle="14 July: AT&T Stadium Dallas · 15 July: Mercedes-Benz Stadium Atlanta"
            matches={semiFinalMatches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            gridClassName="section__grid--center"
            sectionClassName="section--centered"
          />

          <MatchSection
            id="final"
            title="The Final"
            subtitle="19 July 2026 · MetLife Stadium, New Jersey — 12:30 AM IST (20 July)"
            matches={finalMatches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            now={now}
            gridClassName="section__grid--center section__grid--final"
            sectionClassName="section--centered"
          />
        </div>

        <TeamsSection favorites={favorites} onToggleFavorite={toggleFavorite} now={now} />
        <StandingsSection />
        <FavoritesSection favorites={favorites} onToggleFavorite={toggleFavorite} now={now} />
        <StadiumExplorer />
        <TournamentStatsSection />
        <GroupPredictionSection />
        <GlobalSearchSection />
      </main>

      <footer className="app__footer">
        <p>FIFA World Cup Monk | FIFA World Cup 2026 | Track Every Match. Every Team. Every Moment.</p>
      </footer>
    </div>
  );
}
