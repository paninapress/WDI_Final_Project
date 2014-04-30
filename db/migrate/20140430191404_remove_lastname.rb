class RemoveLastname < ActiveRecord::Migration
  def change
    drop_table :last_names
  end
end
