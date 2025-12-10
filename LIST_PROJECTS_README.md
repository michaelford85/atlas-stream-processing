# List MongoDB Atlas Projects

This playbook allows you to list all MongoDB Atlas Projects (also known as "Groups" in the Atlas API) that your API credentials have access to.

## Prerequisites

1. MongoDB Atlas Account
2. Atlas Programmatic API Keys with appropriate permissions
3. Ansible installed on your system

## Setup

1. Create API Keys in MongoDB Atlas:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Navigate to **Access Manager → API Keys** (or **Organization Access → API Keys**)
   - Click **Create API Key**
   - Assign the key **Organization Member** or **Project Owner** permissions
   - Save your **Public Key** and **Private Key**

2. Configure credentials:
   ```bash
   # Copy the template file
   cp vars/atlas_credentials.yml vars/atlas_credentials_local.yml
   
   # Edit the local file with your actual credentials
   # Note: atlas_credentials_local.yml is gitignored for security
   ```

3. Update `vars/atlas_credentials_local.yml`:
   ```yaml
   atlas_base_url: "https://cloud.mongodb.com"
   atlas_public_key: "your-actual-public-key"
   atlas_private_key: "your-actual-private-key"
   ```

## Usage

Run the playbook:

```bash
ansible-playbook list-atlas-projects.yml
```

If you want to use a specific credentials file:

```bash
ansible-playbook list-atlas-projects.yml -e @vars/atlas_credentials_local.yml
```

## Output

The playbook will display information about all projects you have access to:

```
========================================
MongoDB Atlas Projects
========================================
Total Projects: 3

Project Name: Production
Project ID:   5f8a1b2c3d4e5f6g7h8i9j0k
Created:      2024-01-15T10:30:00Z
---
Project Name: Development
Project ID:   1a2b3c4d5e6f7g8h9i0j1k2l
Created:      2024-02-20T14:45:00Z
---
```

## Security Notes

- **Never commit** `vars/atlas_credentials_local.yml` to version control
- API keys provide programmatic access to your Atlas organization
- Use environment-specific credentials for production environments
- Rotate your API keys regularly

## API Reference

This playbook uses the MongoDB Atlas Administration API:
- Endpoint: `GET /api/atlas/v2/groups`
- Documentation: https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/#tag/Projects/operation/listProjects
