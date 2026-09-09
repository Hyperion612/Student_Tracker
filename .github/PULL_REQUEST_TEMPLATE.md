name: Pull Request
description: Create a pull request
title: "[PR] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to create a pull request!
  
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe your changes
      placeholder: What did you change?
    validations:
      required: true
  
  - type: textarea
    id: motivation
    attributes:
      label: Motivation
      description: Why is this change needed?
      placeholder: What problem does this solve?
    validations:
      required: true
  
  - type: textarea
    id: testing
    attributes:
      label: Testing
      description: How did you test your changes?
      placeholder: Describe your testing approach
    validations:
      required: true
  
  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: My code follows the project's style guidelines
          required: true
        - label: I have performed a self-review of my code
          required: true
        - label: I have commented my code, particularly in hard-to-understand areas
        - label: My changes generate no new warnings
          required: true
        - label: I have added tests that prove my fix is effective or that my feature works
        - label: New and existing unit tests pass locally with my changes
          required: true
  
  - type: dropdown
    id: type
    attributes:
      label: Type of change
      options:
        - Bug fix (non-breaking change which fixes an issue)
        - New feature (non-breaking change which adds functionality)
        - Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - Documentation update
    validations:
      required: true
