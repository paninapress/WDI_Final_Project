class AddGroupsToUser < ActiveRecord::Migration
  def change
    add_column :users, :groupOneAverage, :float
    add_column :users, :groupTwoAverage, :float
    add_column :users, :groupThreeAverage, :float
    add_column :users, :groupFourAverage, :float
  end
end
