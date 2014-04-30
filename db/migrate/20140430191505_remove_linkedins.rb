class RemoveLinkedins < ActiveRecord::Migration
  def change
    drop_table :linkedins
  end
end
