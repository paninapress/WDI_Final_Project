class RemoveFirstNameIdAndLastNameIdFromConnections < ActiveRecord::Migration
  def change
    remove_column :connections, :first_name_id
    remove_column :connections, :last_name_id
  end
end
