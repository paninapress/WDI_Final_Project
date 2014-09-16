class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.belongs_to :user, index: true
      t.float :averageOne
      t.float :averageTwo
      t.float :averageThree
      t.float :averageFour
      t.float :averageOverall

      t.timestamps
    end
  end
end
