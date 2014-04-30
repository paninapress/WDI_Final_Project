class RemoveContactIdFromConnections < ActiveRecord::Migration
  def change
    remove_column :connections, :contact_id, :string
  end
end
