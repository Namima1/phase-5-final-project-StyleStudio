"""Add password field to User model

Revision ID: e46ab1874b5b
Revises: 75e332f5ea0e
Create Date: 2025-01-21 11:11:37.998460

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e46ab1874b5b'
down_revision = '75e332f5ea0e'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.String(), nullable=False, server_default='defaultpassword'))

def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('password')

