class AddRecentLogToConnections < ActiveRecord::Migration
  def change
  	add_column :connections, :recent_log, :date
  end
end
