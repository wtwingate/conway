(ns conway.core)

(defn -main
  "I don't do a lot... yet!"
  [& args]
  (print-grid (create-random-grid 5)))

(defn create-random-column
  [size]
  (into [] (repeatedly size #(rand-nth '(" " "#")))))

(defn create-random-grid
  [size]
  (into [] (repeatedly size #(create-column size))))

(defn print-grid
  [grid]
  (print (reduce str (map (fn [column] (str (reduce str column) "\n")) grid))))

(defn count-live-neighbors
  [grid x y]
  (let [neighbors (conj (vector)
                        (get-in grid [(+ x 0) (+ y 1)])
                        (get-in grid [(+ x 1) (+ y 1)])
                        (get-in grid [(+ x 1) (+ y 0)])
                        (get-in grid [(+ x 1) (- y 1)])
                        (get-in grid [(+ x 0) (- y 1)])
                        (get-in grid [(- x 1) (- y 1)])
                        (get-in grid [(- x 1) (+ y 0)])
                        (get-in grid [(- x 1) (+ y 1)]))]
    (count (filter #(= "#" %) neighbors))))

(defn generate-new-grid
  [grid]
  (map-indexed (fn [x-idx column]
                 (map-indexed (fn [y-idx cell]
                                (let [live-neighbors (count-live-neighbors grid x-idx y-idx)]
                                  (if (= "#" cell)
                                    (cond
                                      (< 2 live-neighbors) " "
                                      (> 3 live-neighbors) " "
                                      :else "#")
                                    (cond
                                      (= 3 live-neighbors) "#"
                                      :else " "))))) column) grid))
