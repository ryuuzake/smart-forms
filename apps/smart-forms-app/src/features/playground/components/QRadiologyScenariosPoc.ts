export const QRadiologyScenariosPoc = {
  resourceType: 'Questionnaire',
  id: 'RadiologyScenariosPoc',
  contained: [
    {
      resourceType: 'ValueSet',
      id: 'AssociatedSite2',
      status: 'draft',
      compose: {
        include: [
          {
            system: 'http://snomed.info/sct',
            filter: [
              {
                property: 'constraint',
                op: '=',
                value: '{{%procedureCode2}}.<<363704007|Site|'
              }
            ]
          }
        ]
      }
    },
    {
      resourceType: 'ValueSet',
      id: 'SubConceptsAssociatedSites3',
      status: 'draft',
      compose: {
        include: [
          {
            system: 'http://snomed.info/sct',
            filter: [
              {
                property: 'constraint',
                op: '=',
                value: '<{{%procedureCode3}}.<<363704007|Site|'
              }
            ]
          }
        ]
      }
    },
    {
      resourceType: 'ValueSet',
      id: 'SubConceptsAssociatedSites4',
      status: 'draft',
      compose: {
        include: [
          {
            system: 'http://snomed.info/sct',
            filter: [
              {
                property: 'constraint',
                op: '=',
                value: '<{{%procedureCode4}}.<<363704007|Site|'
              }
            ]
          }
        ]
      }
    }
  ],
  url: 'https://smartforms.csiro.au/docs/radiology-scenarios',
  version: '0.1.0',
  name: 'RadiologyScenarios',
  title: 'Radiology Scenarios',
  status: 'draft',
  date: '2024-05-01',
  publisher: 'AEHRC CSIRO',
  item: [
    {
      linkId: 'Disclaimer',
      text: 'This is a proof-of-concept of dynamic terminology usage. The logic might not be fully reliable, and visual elements like loading indicators and error messages are not finalized.',
      _text: {
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml',
            valueString:
              '<div xmlns="http://www.w3.org/1999/xhtml">\r\n    <em>This is a proof-of-concept of dynamic terminology usage. The logic might not be fully reliable, and visual elements like loading indicators and error messages are not finalized.</em>\r\n    </div>'
          }
        ]
      },
      type: 'display'
    },
    {
      linkId: 'scenario-1',
      text: "1. Request for Procedure + Site as 'Single item'",
      type: 'group',
      item: [
        {
          linkId: 'Guidance1',
          text: 'Example: X-ray of left hand',
          _text: {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml',
                valueString:
                  '<div xmlns="http://www.w3.org/1999/xhtml">\r\n    Example: <b>X-ray of right foot</b>\r\n    </div>'
              }
            ]
          },
          type: 'display'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/questionnaire-item-control',
                    code: 'autocomplete'
                  }
                ]
              }
            }
          ],
          linkId: 'scenario-1-procedure',
          text: 'Procedure',
          type: 'choice',
          answerValueSet: 'https://healthterminologies.gov.au/fhir/ValueSet/imaging-procedure-1'
        }
      ]
    },
    {
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'procedureCode2',
            language: 'text/fhirpath',
            expression: "item.where(linkId='scenario-2-procedure').answer.value.code"
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'associatedSite2',
            language: 'text/fhirpath',
            expression:
              "iif(%procedureCode2.exists(), expand('http://snomed.info/sct?fhir_vs%3Decl%2F' + %procedureCode2 + '.%3C%3C363704007').expansion.contains[0], '' )"
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'enableLateralityComponents2',
            language: 'text/fhirpath',
            expression:
              "%associatedSite2.memberOf('http://snomed.info/sct?fhir_vs=refset/723264001') and %procedureCode2.exists()"
          }
        }
      ],
      linkId: 'scenario-2',
      text: '2. Request for Procedure - populate Site if present',
      type: 'group',
      item: [
        {
          linkId: 'Guidance2',
          text: 'Example with Site: X-ray of right foot, Example without site: X-ray',
          _text: {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml',
                valueString:
                  '<div xmlns="http://www.w3.org/1999/xhtml">\r\n    Example with site: <b>X-ray of right foot</b>\r\n<br/>Example without site: <b>X-ray</b>    </div>'
              }
            ]
          },
          type: 'display'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/questionnaire-item-control',
                    code: 'autocomplete'
                  }
                ]
              }
            }
          ],
          linkId: 'scenario-2-procedure',
          text: 'Procedure',
          type: 'choice',
          answerValueSet: 'https://healthterminologies.gov.au/fhir/ValueSet/imaging-procedure-1'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
              valueExpression: {
                language: 'text/fhirpath',
                expression: '%associatedSite2.display'
              }
            }
          ],
          linkId: 'scenario-2-associated-site',
          text: 'Associated site',
          type: 'text',
          enableWhen: [
            {
              question: 'scenario-2-procedure',
              operator: 'exists',
              answerBoolean: true
            }
          ]
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
              valueExpression: {
                language: 'text/fhirpath',
                expression: '%enableLateralityComponents2'
              }
            }
          ],
          linkId: 'scenario-2-site-laterality',
          text: 'Laterality',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/ValueSet/bodysite-laterality'
        }
      ]
    },
    {
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'procedureCode3',
            language: 'text/fhirpath',
            expression: "item.where(linkId='scenario-3-procedure').answer.value.code"
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'associatedSite3',
            language: 'text/fhirpath',
            expression: "item.where(linkId='scenario-3-associated-site').answer.value"
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'procedureHasSiteBoolean3',
            language: 'text/fhirpath',
            expression:
              "iif(%procedureCode3.exists(), expand('http://snomed.info/sct?fhir_vs%3Decl%2F' + %procedureCode3 + '.%3C%3C363704007').expansion.contains.count() > 0, false )"
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'enableSiteSelection3',
            language: 'text/fhirpath',
            expression: '%procedureCode3.exists() and %procedureHasSiteBoolean3 = false'
          }
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/variable',
          valueExpression: {
            name: 'enableLateralityComponents3',
            language: 'text/fhirpath',
            expression:
              "%associatedSite3.memberOf('http://snomed.info/sct?fhir_vs=refset/723264001') and %procedureCode3.exists()"
          }
        }
      ],
      linkId: 'scenario-3',
      text: '3. Request for Procedure - allow further site refinement if site not present',
      type: 'group',
      item: [
        {
          linkId: 'Guidance3',
          text: 'Example with Site: Magnetic resonance imaging, Example without site: Magnetic resonance imaging of chest',
          _text: {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml',
                valueString:
                  '<div xmlns="http://www.w3.org/1999/xhtml">\r\n    Example with site: <b>Magnetic resonance imaging</b>\r\n<br/>Example without site: <b>Magnetic resonance imaging of chest</b>    </div>'
              }
            ]
          },
          type: 'display'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/questionnaire-item-control',
                    code: 'autocomplete'
                  }
                ]
              }
            }
          ],
          linkId: 'scenario-3-procedure',
          text: 'Procedure',
          type: 'choice',
          answerValueSet: 'https://healthterminologies.gov.au/fhir/ValueSet/imaging-procedure-1'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
              valueExpression: {
                language: 'text/fhirpath',
                expression: '%enableSiteSelection3'
              }
            }
          ],
          linkId: 'scenario-3-associated-site',
          text: 'Associated site',
          type: 'choice',
          answerValueSet: '#SubConceptsAssociatedSites3'
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
              valueExpression: {
                language: 'text/fhirpath',
                expression: '%enableLateralityComponents3'
              }
            }
          ],
          linkId: 'scenario-3-site-laterality',
          text: 'Laterality',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/ValueSet/bodysite-laterality'
        }
      ]
    }
  ]
};
