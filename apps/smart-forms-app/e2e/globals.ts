/*
 * Copyright 2024 Commonwealth Scientific and Industrial Research
 * Organisation (CSIRO) ABN 41 687 119 230.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const PLAYWRIGHT_EHR_URL = 'https://proxy.smartforms.io/v/r4/fhir';
export const PLAYWRIGHT_FORMS_SERVER_URL = 'https://smartforms.csiro.au/api/fhir';

export const PLAYWRIGHT_APP_URL = process.env.CI
  ? 'http://localhost:4173'
  : 'http://localhost:5173';

export const LAUNCH_PARAM = process.env.CI
  ? 'WzAsInBhdC1zZiIsInByaW1hcnktcGV0ZXIiLCJBVVRPIiwwLDAsMCwiZmhpclVzZXIgb25saW5lX2FjY2VzcyBvcGVuaWQgcHJvZmlsZSBwYXRpZW50L0NvbmRpdGlvbi5ycyBwYXRpZW50L09ic2VydmF0aW9uLnJzIGxhdW5jaCBwYXRpZW50L0VuY291bnRlci5ycyBwYXRpZW50L1F1ZXN0aW9ubmFpcmVSZXNwb25zZS5jcnVkcyBwYXRpZW50L1BhdGllbnQucnMiLCJodHRwOi8vbG9jYWxob3N0OjQxNzMvIiwiYTU3ZDkwZTMtNWY2OS00YjkyLWFhMmUtMjk5MjE4MDg2M2MxIiwiIiwiIiwiIiwiIiwwLDEsIiIsZmFsc2Vd'
  : 'WzAsInBhdC1zZiIsInByaW1hcnktcGV0ZXIiLCJBVVRPIiwwLDAsMCwiZmhpclVzZXIgb25saW5lX2FjY2VzcyBvcGVuaWQgcHJvZmlsZSBwYXRpZW50L0NvbmRpdGlvbi5ycyBwYXRpZW50L09ic2VydmF0aW9uLnJzIGxhdW5jaCBwYXRpZW50L0VuY291bnRlci5ycyBwYXRpZW50L1F1ZXN0aW9ubmFpcmVSZXNwb25zZS5jcnVkcyBwYXRpZW50L1BhdGllbnQucnMiLCJodHRwOi8vbG9jYWxob3N0OjUxNzMvIiwiMWZmN2JkYzItMzZiMi00MzAzLThjMDUtYzU3MzQyYzViMDQzIiwiIiwiIiwiIiwiIiwwLDEsIiIsZmFsc2Vd';
