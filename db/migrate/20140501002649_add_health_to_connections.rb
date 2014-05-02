class AddHealthToConnections < ActiveRecord::Migration
  def change
    add_column :connections, :health, :float
  end
end
