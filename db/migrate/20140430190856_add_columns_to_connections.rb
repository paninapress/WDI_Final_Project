class AddColumnsToConnections < ActiveRecord::Migration
  def change
    add_column :connections, :picture, :string
    add_column :connections, :first_name, :string
    add_column :connections, :last_name, :string
    add_column :connections, :custom_first_name, :string
    add_column :connections, :custom_last_name, :string
    add_column :connections, :linkedin_pic, :string
    add_column :connections, :facebook_pic, :string
    add_column :connections, :custom_pic, :string
    add_column :connections, :linkedin_id, :string
    add_column :connections, :facebook_id, :string
  end
end
