class AddHealthToConnections < ActiveRecord::Migration
  def change
    add_column :connections, :health, :decimal
  end
end
