
# Quiz System Administration Guide

## Overview

This guide provides detailed procedures for maintaining and managing the Educare Quiz System. It covers question management, content administration, data import/export, and system maintenance tasks.

## Administrative Access

### Accessing the Admin Interface

1. Log in with an admin account
2. Navigate to the Admin Dashboard ("/educare-app/admin")
3. Select "Quiz Management" from the sidebar

### Required Permissions

To manage quiz content, administrators need:
- `quiz_admin` role or
- `admin` role with quiz management permissions

## Question Management

### Adding New Questions

1. Access the admin interface
2. Select the appropriate age group and phase
3. Click "Add New Question"
4. Fill in:
   - Question text
   - Domain (motor, language, social, etc.)
   - Importance note
   - Feedback for both positive and negative responses
   - Associated video suggestions
5. Click "Save Question"

### Modifying Questions

1. Locate the question in the admin interface
2. Click the edit icon (pencil)
3. Edit the desired fields
4. Save changes
5. Review the update in the preview mode

### Bulk Editing Questions

For efficient management of multiple questions:

1. Navigate to "Bulk Actions" in the admin panel
2. Select questions to edit
3. Choose the "Bulk Edit" option
4. Apply changes to all selected questions
5. Review and confirm changes

### Question Guidelines

- Keep questions clear and concise
- Use age-appropriate language
- Include specific examples when needed
- Provide actionable feedback
- Link relevant video content
- Ensure proper domain categorization

## Age Group Management

### Creating a New Age Group

1. Navigate to "Age Groups" in the admin panel
2. Click "Add New Age Group"
3. Fill in:
   - Title (e.g., "7-8 months")
   - Minimum age in months
   - Maximum age in months
   - Description
4. Click "Create Age Group"

### Modifying Age Groups

1. Find the age group in the admin interface
2. Click the edit icon
3. Update fields as needed
4. Save changes

## Development Phase Management

### Adding a New Phase

1. Select an age group
2. Click "Add Phase"
3. Fill in:
   - Title
   - Description
   - Order index (determines display order)
   - Icon class (optional)
   - Visual styling options
4. Click "Create Phase"

### Configuring Phase Appearance

Phases can be customized with:
- Background color (`bg_color`)
- Border color (`border_color`)
- Text color class (`color_class`)
- Badge name (`badge_name`)

Example configuration:
```json
{
  "bg_color": "#0c1445",
  "border_color": "#4c5eaf",
  "color_class": "text-blue-400",
  "badge_name": "Phase",
  "icon_class": "baby-cradle"
}
```

## Video Content Management

### Adding Videos

1. Navigate to "Video Management"
2. Click "Add New Video"
3. Add metadata:
   - Title
   - Description
   - Duration
   - Video URL
   - Thumbnail (optional)
4. Associate with questions
5. Click "Save Video"

### Managing Suggestions

1. Review video-question associations in "Content Associations"
2. Update suggestions based on user feedback
3. Monitor video engagement metrics
4. Remove outdated content
5. Click "Update Associations"

### Video Guidelines

1. **Duration**: Keep videos short (2-5 minutes)
2. **Quality**: Ensure clear audio and video 
3. **Accessibility**: Include captions when possible
4. **Content**: Focus on demonstrating practical techniques
5. **Categorization**: Tag videos appropriately for search functionality

## Data Import/Export

### Importing from JSON

1. Navigate to "Import/Export" in the admin panel
2. Select "Import JSON"
3. Upload a JSON file or paste JSON content
4. Review the import preview
5. Click "Import Data"

Sample JSON format:
```json
{
  "meta": {
    "title": "7-8 months",
    "min_months": 7,
    "max_months": 8,
    "description": "Explorando e Descobrindo"
  },
  "phases": [
    {
      "title": "Week 1",
      "description": "First week milestones",
      "order_index": 0,
      "questions": [
        {
          "domain": "motor",
          "question_text": "Can sit unsupported",
          "importance_note": "Important milestone",
          "positive_feedback_title": "Great progress!",
          "positive_feedback_tips": ["Continue with floor time", "Try supported standing"],
          "negative_feedback_title": "Let's work on this",
          "negative_feedback_tips": ["Practice supported sitting", "Core strengthening activities"],
          "order_index": 0,
          "video_suggestions": [
            {
              "title": "Helping Your Baby Sit Independently",
              "duration_seconds": 240
            }
          ]
        }
      ]
    }
  ]
}
```

### Importing from CSV

1. Navigate to "Import/Export" in the admin panel
2. Select "Import CSV"
3. Fill in age group details:
   - Title
   - Min/max months
   - Description
4. Upload the CSV file
5. Map columns (if needed)
6. Click "Import Data"

CSV format:
```
phase_title,domain,question_text,importance_note,positive_title,positive_tips,negative_title,negative_tips,video_title,video_duration
"Week 1","motor","Can sit unsupported","Important milestone","Great progress!","Continue with floor time|Try supported standing","Let's work on this","Practice supported sitting|Core strengthening activities","Helping Your Baby Sit Independently",240
```

### Exporting Data

1. Navigate to "Import/Export" in the admin panel
2. Select "Export Data"
3. Choose export format (JSON or CSV)
4. Select age groups to export
5. Click "Export"
6. Download the exported file

## Database Management

### Data Cleanup

1. Navigate to "Database Maintenance"
2. Review unused content (questions, videos without associations)
3. Select items to clean up
4. Click "Clean Database"

### Data Integrity Checks

1. Access "System Health" in the admin panel
2. Run "Check Data Integrity"
3. Review and fix any issues:
   - Orphaned questions
   - Missing video associations
   - Invalid domain values

## System Maintenance

### Regular Tasks

1. **Weekly**:
   - Review question effectiveness
   - Update video content
   - Check for broken links

2. **Monthly**:
   - Run data integrity checks
   - Review user feedback
   - Update documentation

3. **Quarterly**:
   - Audit access permissions
   - Review performance metrics
   - Plan content updates

### Data Management

1. **Backups**:
   - Automated daily backups
   - Manual backup before major changes
   - Test restore procedures quarterly

2. **Data Cleanup**:
   - Archive old user progress data
   - Remove unused content
   - Optimize database indexes

3. **Version Control**:
   - Document all content changes
   - Track question versions
   - Maintain changelog

## Analytics and Reporting

### Available Reports

1. **Usage Reports**:
   - Questions answered per day/week/month
   - Most/least answered questions
   - Average quiz completion time

2. **Performance Reports**:
   - Question effectiveness metrics
   - Video engagement statistics
   - Domain performance analysis

### Generating Reports

1. Navigate to "Analytics" in the admin panel
2. Select report type
3. Define date range
4. Choose filtering options
5. Click "Generate Report"
6. Export to CSV/PDF if needed

## Troubleshooting

### Common Issues and Solutions

1. **Question Display Issues**
   - Problem: Questions not appearing in the correct order
   - Solution: Check order_index values and phase associations

2. **Video Playback Problems**
   - Problem: Videos not loading or playing
   - Solution: Verify URLs, check video format compatibility

3. **Progress Tracking Errors**
   - Problem: User progress not being saved
   - Solution: Check user_quiz_progress table permissions and constraints

4. **User Feedback Submission Issues**
   - Problem: Feedback not being recorded
   - Solution: Verify form submission handlers and database connections

5. **Import Failures**
   - Problem: Data import errors
   - Solution: Check JSON/CSV format, ensure required fields are present
   - Common error: `Domain value not allowed` - Only the following domain values are accepted: 'motor', 'cognitive', 'language', 'social', 'sensory', 'emotional'

### Support Resources

For technical support:
- Internal issue tracker: http://issues.internal/educare-admin
- Development team contact: dev-team@educare.example.com
- Knowledge base: http://kb.internal/educare/quiz-system

## Security Guidelines

### Access Control

- Grant minimal necessary permissions
- Regularly audit admin accounts
- Enable two-factor authentication for admin access
- Revoke inactive admin accounts

### Content Guidelines

- Verify all content before publishing
- Ensure content meets accessibility standards
- Obtain proper permissions for all media
- Follow content sensitivity guidelines

## Release Management

When preparing for system updates:

1. Announce maintenance windows
2. Create backup before update
3. Test changes in staging environment
4. Apply updates during low-usage periods
5. Verify functionality post-update
6. Monitor system for 24 hours after update

## Appendix

### Domain Types Reference

| Domain     | Description                              | Example Questions                                   |
|------------|------------------------------------------|----------------------------------------------------|
| motor      | Physical movement and control            | Can climb stairs, Can hold a pencil                 |
| cognitive  | Thinking and problem-solving             | Can stack blocks, Understands cause and effect      |
| language   | Communication and verbal skills          | Can say 2-3 word sentences, Follows instructions    |
| social     | Interaction with others                  | Plays cooperatively, Shows empathy                  |
| sensory    | Response to sensory input                | Tolerates different textures, Not sensitive to noise|
| emotional  | Expression and regulation of emotions    | Can self-soothe, Shows varied emotional responses   |

### Import Error Codes

| Error Code | Description                             | Solution                                           |
|------------|-----------------------------------------|----------------------------------------------------|
| E001       | Invalid JSON format                     | Check JSON syntax                                  |
| E002       | Missing required fields                 | Ensure all required fields are present             |
| E003       | Invalid domain value                    | Use only allowed domain values                     |
| E004       | Duplicate question                      | Remove duplicate questions or use update mode      |
| E005       | Invalid age range                       | Ensure min_months < max_months                     |
