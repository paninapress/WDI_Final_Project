class AddHealthAndFullnameToConnections < ActiveRecord::Migration
  def change
    add_column :connections, :health, :float
    add_column :connections, :fullname, :string
  end
end
